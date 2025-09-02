// server/utils/emailService.js
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

const createTransporter = () => {
  return nodemailer.createTransport({
    // Note: createTransport not createTransporter
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
};

const loadTemplate = (templateName) => {
  const templatePath = path.join(
    process.cwd(),
    "utils",
    "email-templates",
    `${templateName}.html`
  );
  return fs.readFileSync(templatePath, "utf8");
};

// Simple variable replacement for other templates
const replaceVariables = (template, variables) => {
  let result = template;
  Object.keys(variables).forEach((key) => {
    const regex = new RegExp(`{{${key}}}`, "g");
    result = result.replace(regex, variables[key] || "");
  });
  return result;
};

// Process order confirmation template with conditional content
const processOrderTemplate = (template, variables) => {
  let result = template;

  // Handle customer/admin conditional sections
  if (variables.isCustomer) {
    // Customer header
    result = result.replace(
      "{{customerHeader}}",
      `
      <h1 style="text-align: center; color: #333; font-size: 24px; margin: 30px 0 30px 0; font-weight: bold;">Order Received</h1>
      <p style="text-align: center; color: #666; font-size: 14px; line-height: 1.5; margin: 0;">Thank you for your order! Your order has been received and is currently being processed. Please expect a detailed quote via email within 1-2 business days for confirmation. This order is&nbsp;<strong>not yet confirmed</strong> until you receive and approve our quote.</p>
    `
    );
    result = result.replace("{{adminHeader}}", "");

    // Customer address section
    result = result.replace(
      "{{customerAddressSection}}",
      `<div style="color: #333; font-size: 14px;"><strong>Address:</strong> ${variables.customerAddress}</div>`
    );
    result = result.replace("{{adminEmailSection}}", "");

    // Customer status
    result = result.replace(
      "{{customerStatus}}",
      '<div style="color: #667eea; font-size: 14px; margin-bottom: 5px;">Status: Pending Quote</div>'
    );
    result = result.replace("{{adminAddressSection}}", "");

    // Customer warning
    result = result.replace(
      "{{customerWarning}}",
      `
      <div style="text-align: center; padding: 10px; background-color: #fff3cd; border-radius: 4px; border-left: 4px solid #ffc107;">
        <small style="color: #856404; font-size: 12px;"><strong>⚠️ Note:</strong> Final pricing will be confirmed in your quote</small>
      </div>
    `
    );

    // Customer footer
    result = result.replace(
      "{{footerContent}}",
      `
      <div style="color: #666; font-size: 12px; margin-bottom: 10px;">Questions? Contact us at <strong>(323) 943-9318</strong> or <strong>sales@adamsfoods.us</strong></div>
      <div style="color: #999; font-size: 11px;">AdamsFoods Wholesale | 1805 Industrial St, Los Angeles, CA 90021</div>
    `
    );
  } else if (variables.isAdmin) {
    // Admin header
    result = result.replace(
      "{{adminHeader}}",
      `
      <h1 style="text-align: center; color: #333; font-size: 24px; margin: 30px 0 30px 0; font-weight: bold;">New Order Submitted</h1>
      <p style="text-align: center; color: #666; font-size: 14px; line-height: 1.5; margin: 0;">A new order was submitted on ${variables.orderDate}.</p>
    `
    );
    result = result.replace("{{customerHeader}}", "");

    // Admin email section
    result = result.replace(
      "{{adminEmailSection}}",
      `<div style="color: #333; font-size: 14px;"><strong>Email:</strong> ${variables.email}</div>`
    );
    result = result.replace("{{customerAddressSection}}", "");

    // Admin address section
    result = result.replace(
      "{{adminAddressSection}}",
      `<div style="color: #667eea; font-size: 14px; margin-bottom: 5px;">Address: ${variables.customerAddress}</div>`
    );
    result = result.replace("{{customerStatus}}", "");

    // No warning for admin
    result = result.replace("{{customerWarning}}", "");

    // Admin footer
    result = result.replace(
      "{{footerContent}}",
      `
      <div style="color: #666; font-size: 12px; margin-bottom: 10px;">New Order Alert - AdamsFoods Wholesale System</div>
      <div style="color: #999; font-size: 11px;">Please review and process this order promptly</div>
    `
    );
  }

  // Process order items
  let orderItemsRows = "";
  if (variables.orderItems && variables.orderItems.length > 0) {
    orderItemsRows = variables.orderItems
      .map((item) => {
        const quantityDisplay = variables.isAdmin
          ? `${item.quantity} lbs`
          : item.quantity;
        return `
        <tr>
          <td style="padding: 12px 8px; color: #333; font-size: 14px; border-bottom: 1px solid #f0f0f0;">${item.name}</td>
          <td style="text-align: center; padding: 12px 8px; color: #333; font-size: 14px; border-bottom: 1px solid #f0f0f0;">${quantityDisplay}</td>
          <td style="text-align: right; padding: 12px 8px; color: #333; font-size: 14px; border-bottom: 1px solid #f0f0f0;">$${item.price}</td>
          <td style="text-align: right; padding: 12px 8px; color: #333; font-size: 14px; border-bottom: 1px solid #f0f0f0; font-weight: bold;">$${item.itemTotal}</td>
        </tr>
      `;
      })
      .join("");
  }
  result = result.replace("{{orderItemsRows}}", orderItemsRows);

  // Replace remaining simple variables
  Object.keys(variables).forEach((key) => {
    if (!["isCustomer", "isAdmin", "orderItems"].includes(key)) {
      const regex = new RegExp(`{{${key}}}`, "g");
      result = result.replace(regex, variables[key] || "");
    }
  });

  return result;
};
const processInquiryResponseTemplate = (template, variables) => {
  let result = template;

  const referenceSection =
    variables.responseType === "inquiry"
      ? `
    <div style="padding: 20px 30px; background-color: #f8f9fa; border-top: 1px solid #e9ecef;">
    <div style="color: #666; font-size: 12px; line-height: 1.4;">
    <strong>Your original inquiry:</strong><br>
    <em>"${variables.originalMessage}"</em><br><br>
    <strong>Company:</strong> ${variables.companyName} | <strong>Date:</strong> ${variables.inquiryDate}
    </div>
    </div>
  `
      : "";

  result = result.replace("{{referenceSection}}", referenceSection);

  // Replace remaining simple variables
  Object.keys(variables).forEach((key) => {
    if (key !== "responseType") {
      const regex = new RegExp(`{{${key}}}`, "g");
      result = result.replace(regex, variables[key] || "");
    }
  });

  return result;
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (
  orderData,
  isAdmin = false
) => {
  const transporter = createTransporter();

  try {
    const template = loadTemplate("order-confirmation");

    const templateVariables = {
      ...orderData,
      isCustomer: !isAdmin,
      isAdmin: isAdmin,
    };

    const emailContent = processOrderTemplate(template, templateVariables);

    const recipientEmail = isAdmin ? "sales@adamsfoods.us" : orderData.email;
    const subject = isAdmin
      ? `New Order #${orderData.orderNumber} - ${orderData.customerName}`
      : `Order Confirmation #${orderData.orderNumber}`;

    const mailOptions = {
      from: `"AdamsFoods Wholesale" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: subject,
      html: emailContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${recipientEmail}:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error: error.message };
  }
};

// Send contact us inquiry email
export const sendContactUsEmail = async (inquiryData) => {
  const transporter = createTransporter();

  try {
    const template = loadTemplate("contact-us");
    const emailContent = replaceVariables(template, {
      ...inquiryData,
      time: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    const mailOptions = {
      from: `"AdamsFoods Wholesale" <${process.env.EMAIL_USER}>`,
      to: "sales@adamsfoods.us",
      subject: `New Contact Inquiry from ${inquiryData.name}`,
      html: emailContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Contact inquiry sent:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Contact inquiry email failed:", error);
    return { success: false, error: error.message };
  }
};

// Send signup request email
export const sendSignupRequestEmail = async (signupData) => {
  const transporter = createTransporter();

  try {
    const template = loadTemplate("sign-up");
    const emailContent = replaceVariables(template, {
      first_name: signupData.firstName,
      last_name: signupData.lastName,
      name: `${signupData.firstName} ${signupData.lastName}`,
      email: signupData.email,
      phone: signupData.phone || "",
      company: signupData.companyName, 
      business_license: signupData.licenseNumber,
      company_address_1: signupData.companyAddress1 || "",
      company_address_2: signupData.companyAddress2 || "",
      city: signupData.city || "",
      state: signupData.state || "",
      zip_code: signupData.zipCode || "",
      california_resale: signupData.californiaResale || "",
      time: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    const mailOptions = {
      from: `"AdamsFoods Wholesale" <${process.env.EMAIL_USER}>`,
      to: "sales@adamsfoods.us",
      subject: `New Wholesale Account Request - ${signupData.companyName}`,  // Also changed here
      html: emailContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Signup request sent:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Signup request email failed:", error);
    return { success: false, error: error.message };
  }
};

// Send inquiry response email with conditional reference section
export const sendInquiryResponseEmail = async (inquiryData) => {
  const transporter = createTransporter();

  try {
    const template = loadTemplate("general-response");
    const emailContent = processInquiryResponseTemplate(template, inquiryData);

    const mailOptions = {
      from: `"AdamsFoods Wholesale" <${process.env.EMAIL_USER}>`,
      to: inquiryData.email,
      subject: `Re: Your inquiry - AdamsFoods`,
      html: emailContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      `Inquiry response sent to ${inquiryData.email}:`,
      info.messageId
    );
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Inquiry response email failed:", error);
    return { success: false, error: error.message };
  }
};

// Send forgot password email
export const sendForgotPasswordEmail = async (userData, resetToken) => {
  const transporter = createTransporter();

  try {
    // Use your custom environment variables
    const frontendUrl = process.env.DEV_CLIENT_HOSTNAME && process.env.DEV_CLIENT_PORT
      ? `${process.env.DEV_CLIENT_HOSTNAME}:${process.env.DEV_CLIENT_PORT}`  // Development
      : process.env.FRONTEND_URL;  // Production

    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(userData.email)}`;
    console.log("Frontend URL:", frontendUrl);
    console.log("Reset URL:", resetUrl);
        
    const template = loadTemplate("forgot-password");
    const emailContent = replaceVariables(template, {
      customerName: userData.name || "User",
      resetUrl: resetUrl,
    });

    const mailOptions = {
      from: `"AdamsFoods Wholesale" <${process.env.EMAIL_USER}>`,
      to: userData.email,
      subject: "Reset Your Password - AdamsFoods",
      html: emailContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${userData.email}:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Password reset email failed:", error);
    return { success: false, error: error.message };
  }
};

export const sendSignupApprovalEmail = async (requestData) => {
  const transporter = createTransporter();

  try {
    const template = loadTemplate("sign-up-approval");
    const emailContent = replaceVariables(template, {
      first_name: requestData.first_name,
      last_name: requestData.last_name,
    });

    const mailOptions = {
      from: `"AdamsFoods Wholesale" <${process.env.EMAIL_USER}>`,
      to: requestData.email,
      subject: "Welcome to AdamsFoods - Account Approved!",
      html: emailContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Approval email sent to ${requestData.email}:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Signup approval email failed:", error);
    return { success: false, error: error.message };
  }
};

// Send signup rejection email
export const sendSignupRejectionEmail = async (requestData, reason = '') => {
  const transporter = createTransporter();

  try {
    const template = loadTemplate("sign-up-rejection");
    
    // Create reason section
    const reasonSection = reason 
      ? `
      <div style="padding: 20px 30px; border-bottom: 3px solid #f0f0f0;">
      <h2 style="text-align: left; color: #333; font-size: 16px; margin: 0 0 15px 0; font-weight: bold;">Reason:</h2>
      <div style="color: #333; font-size: 14px; line-height: 1.6; background-color: #f8f9fa; padding: 15px; border-radius: 6px;">
      ${reason}
      </div>
      </div>
      `
      : '';

    const emailContent = replaceVariables(template, {
      first_name: requestData.first_name,
      last_name: requestData.last_name,
      reasonSection: reasonSection,
    });


    const mailOptions = {
      from: `"AdamsFoods Wholesale" <${process.env.EMAIL_USER}>`,
      to: requestData.email,
      subject: "AdamsFoods Account Application Status",
      html: emailContent,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Signup rejection email failed:", error);
    return { success: false, error: error.message };
  }
};