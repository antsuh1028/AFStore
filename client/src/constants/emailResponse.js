export const inquiryResponseTemplate = `<div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: linear-gradient(135deg, #c1f1ff 30%, #C9E8FF 100%); padding: 30px;">
<div style="background: white; border-radius: 8px; padding: 0; box-shadow: 0 10px 30px rgba(0,0,0,0.2);"><!-- Brand Header -->
<div style="background: linear-gradient(135deg, #a8c8e8 0%, #7fb3d8 100%); padding: 25px 30px; border-radius: 8px 8px 0 0; text-align: center; border-bottom: 4px solid #5a92b8;">
<h1 style="margin: 0; font-family: 'SUIT-Regular', system-ui, -apple-system, sans-serif; font-size: 28px; font-weight: bold; color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); letter-spacing: 1px;">AdamsFoods</h1>
<div style="margin: 5px 0 0 0; font-size: 14px; color: #f0f4f8; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; font-family: 'SUIT-Regular', system-ui, -apple-system, sans-serif;">W H O L E S A L E</div>
<div style="margin: 8px auto 0 auto; width: 60px; height: 2px; background: linear-gradient(to right, transparent, #f0f4f8, transparent);">&nbsp;</div>
</div>
<!-- Email Content -->
<div style="padding: 40px 30px;">
<div style="color: #333; font-size: 16px; line-height: 1.6;"><!-- Greeting -->
<p style="margin: 0 0 20px 0;">Hello {{customerName}},</p>
<!-- Main Response -->
<div style="margin-bottom: 25px; white-space: pre-line;">{{responseMessage}}</div>
<!-- Sign-off -->
<p style="margin: 25px 0 5px 0;">Best regards,</p>
<p style="margin: 0; font-weight: bold;">Adams Sales Team</p>
</div>
</div>
<!-- Reference Section -->
<div style="padding: 20px 30px; background-color: #f8f9fa; border-top: 1px solid #e9ecef;">
<div style="color: #666; font-size: 12px; line-height: 1.4;"><strong>Your original inquiry:</strong><br><em>"{{originalMessage}}"</em><br><br><strong>Company:</strong> {{companyName}} | <strong>Date:</strong> {{inquiryDate}}</div>
</div>
<!-- Footer -->
<div style="padding: 25px 30px; text-align: center; background-color: #f8f9fa; border-radius: 0 0 8px 8px;">
<div style="color: #666; font-size: 12px; margin-bottom: 10px;">AdamsFoods Wholesale | <strong>(323) 943-9318</strong> | <strong>sales@adamsfoods.us</strong></div>
<div style="color: #999; font-size: 11px; margin-bottom: 8px;">1805 Industrial St, Los Angeles, CA 90021</div>
<div style="color: #999; font-size: 11px;">Business Hours: Mon&ndash;Fri, 8:00AM&ndash;3:30PM PST</div>
</div>
</div>
</div>`