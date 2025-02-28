const nodemailer = require("nodemailer");
const User = require("../models/User");
const Category = require("../models/Category");
const EarlyRegistration = require("../models/EarlyRegistration");
const { validationResult } = require('express-validator');
const axios = require('axios');

exports.getIndexPage = (req, res) => {
  res.status(200).render("index", {
    title: "Ana Sayfa",
  });
};
exports.getAboutPage = (req, res) => {
  res.status(200).render("about", {
    title: "Hakkımızda",
  });
};

exports.getContactPage = (req, res) => {
  res.status(200).render("contact", {
    title: "İletişim",
  });
};
exports.getGaleriPage = (req, res) => {
  res.status(200).render("galeri", {
    title: "Galeri",
  });
};
exports.getLoginPage = (req, res) => {
  res.status(200).render("login", {
    title: "Giriş",
  });
};
exports.getRegisterPage = (req, res) => {
  res.status(200).render("register", {
    title: "Kayıt",
  });
};
exports.getNewBlogPage = async (req, res) => {

  const user = await User.findById(req.session.userID);
  const categories = await Category.find();
  res.status(200).render("newblog", {
    title: "Blog",
    user,
    categories,
  });
};

// Helper function to verify reCAPTCHA
async function verifyCaptcha(recaptchaResponse) {
  if (!recaptchaResponse) {
    return false;
  }
  
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`;
    
    const response = await axios.post(verificationURL);
    return response.data.success;
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return false;
  }
}

exports.sendEmail = async (req, res) => {
  try {
    // Basic validation
    if (!req.body.name || !req.body.message) {
      req.flash('error', 'Lütfen isim ve mesaj alanlarını doldurunuz.');
      return res.status(400).redirect('/contact');
    }
    
    // Verify captcha
    const captchaVerified = await verifyCaptcha(req.body['g-recaptcha-response']);
    if (!captchaVerified) {
      req.flash('error', 'Lütfen robot olmadığınızı doğrulayın.');
      return res.status(400).redirect('/contact');
    }

    const outputMessage = `
      <h1>İletişim Formu</h1>
      <h2>Bilgiler</h2>
      <ul>
        <li>Ad: ${req.body.name}</li>
        <li>Telefon: ${req.body.tel || 'Belirtilmemiş'}</li>
        <li>Email: ${req.body.email || 'Belirtilmemiş'}</li>
      </ul>
      <h3>Mesaj</h3>
      <p>${req.body.message}</p>
    `;

    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    let mailOptions = {
      from: process.env.GMAIL_USER,  // sender address
      to: process.env.RECIPIENT_EMAIL || 'ayseogretmenanaokulu@gmail.com',  // recipient email
      subject: 'İletişim Formu - Yeni Mesaj',
      html: outputMessage,
    };

    await transporter.sendMail(mailOptions);

    req.flash('success', 'Mesajınız başarıyla gönderildi.');
    res.status(200).redirect('/contact');
  } catch (error) {
    console.error('Email sending error:', error);
    req.flash('error', 'Mesajınız gönderilemedi.');
    res.status(400).redirect('/contact');
  }
};

exports.handleEarlyRegistration = async (req, res) => {
  try {
    // Basic validation
    if (!req.body.fullname || !req.body.phone || !req.body.message) {
      req.flash('error', 'Lütfen tüm alanları doldurunuz.');
      return res.status(400).redirect('/contact#erkenKayit');
    }
    
    // Verify captcha
    const captchaVerified = await verifyCaptcha(req.body['g-recaptcha-response']);
    if (!captchaVerified) {
      req.flash('error', 'Lütfen robot olmadığınızı doğrulayın.');
      return res.status(400).redirect('/contact#erkenKayit');
    }

    // Save to database
    await EarlyRegistration.create({
      fullname: req.body.fullname,
      phone: req.body.phone,
      message: req.body.message
    });

    // Send email notification
    const outputMessage = `
      <h1>Erken Kayıt Formu</h1>
      <h2>Bilgiler</h2>
      <ul>
        <li>Ad Soyad: ${req.body.fullname}</li>
        <li>Telefon: ${req.body.phone}</li>
      </ul>
      <h3>Mesaj</h3>
      <p>${req.body.message}</p>
    `;

    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    let mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.RECIPIENT_EMAIL || 'ayseogretmenanaokulu@gmail.com',
      subject: '2025-2026 ERKEN KAYIT BAŞVURUSU',
      html: outputMessage,
    };

    await transporter.sendMail(mailOptions);

    req.flash('success', 'Erken kayıt başvurunuz başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.');
    res.status(200).redirect('/contact#erkenKayit');
  } catch (error) {
    console.error('Early registration error:', error);
    req.flash('error', 'Başvurunuz alınamadı. Lütfen tekrar deneyiniz.');
    res.status(400).redirect('/contact#erkenKayit');
  }
};
