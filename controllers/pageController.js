const nodemailer = require("nodemailer");

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

exports.sendEmail = async (req, res) => {
  try {
    const outputMessage = `
      <h1>İletişim Formu</h1>
      <h2>Bilgiler</h2>
      <ul>
        <li>Ad: ${req.body.name}</li>
        <li>Email: ${req.body.email}</li>
      </ul>
      <h3>Mesaj</h3>
      <p>${req.body.message}</p>
    `;

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL,  // sender address
      to: 'recipient@example.com',  // replace with the actual recipient email
      subject: 'Node.js Email',
      text: 'Hello world?',
      html: outputMessage,
    };

    await transporter.sendMail(mailOptions);

    req.flash('success', 'Mesajınız başarıyla gönderildi.');
    res.status(200).redirect('/contact');
  } catch (error) {
    req.flash('error', 'Mesajınız gönderilemedi.');
    res.status(400).redirect('/contact');
  }
};
