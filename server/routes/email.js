import express from 'express';
import { sendInquiryResponseEmail } from '../utils/emailService.js';

const EmailRouter = express.Router();

EmailRouter.post('/send-inquiry-response', async (req, res) => {
  try {
    const result = await sendInquiryResponseEmail(req.body);
    
    if (result.success) {
      res.json({ success: true, message: 'Response sent successfully' });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

EmailRouter.post('/send-contact-notification', async (req, res) => {
  try {
    const result = await sendContactUsEmail(req.body);
    
    if (result.success) {
      res.json({ success: true, message: 'Contact notification sent successfully' });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error('Contact email error:', error);
    res.status(500).json({ error: 'Failed to send contact notification' });
  }
});
export default EmailRouter;