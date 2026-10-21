interface EmailData {
  name: string
  email: string
  company: string
  message: string
}

export function thankYouEmailTemplate(data: EmailData): string {
  const firstName = data.name.trim().split(' ')[0] || 'there'

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inquiry Received</title>
</head>
<body style="margin:0;padding:0;background-color:#030712;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#030712;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);background-color:#071224;">
          
          <!-- Header -->
          <tr>
            <td style="padding:32px 40px;background-color:#040914;border-bottom:2px solid #FF5722;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size:24px;font-weight:bold;color:#FFFFFF;letter-spacing:-0.5px;">MIKO<span style="color:#FF5722;">.</span>QUINIT</span>
                    <div style="font-size:10px;font-family:monospace;color:#94A3B8;letter-spacing:2px;text-transform:uppercase;margin-top:2px;">Full-Stack Web &amp; Database Engineer</div>
                  </td>
                  <td align="right">
                    <span style="font-size:11px;font-family:monospace;color:#FF5722;background-color:rgba(255,87,34,0.1);padding:4px 10px;border-radius:20px;border:1px solid rgba(255,87,34,0.25);">INQUIRY DISPATCHED</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h1 style="margin:0 0 12px;font-size:22px;font-weight:bold;color:#FFFFFF;">
                Thank you for reaching out, ${firstName}.
              </h1>
              <p style="margin:0 0 24px;font-size:15px;color:#94A3B8;line-height:1.6;">
                I've received your inquiry regarding software development and opportunities. I review messages daily and will reply within <strong style="color:#FF5722;">24 hours</strong>.
              </p>
              
              <!-- Message Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#040914;border-radius:12px;border:1px solid rgba(255,255,255,0.06);margin-bottom:24px;">
                <tr>
                  <td style="padding:20px;">
                    <div style="font-size:10px;color:#64748B;font-family:monospace;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Your Submission Preview</div>
                    <div style="font-size:13px;color:#CBD5E1;line-height:1.6;font-style:italic;">
                      "${data.message}"
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:13px;color:#64748B;line-height:1.6;">
                In the meantime, feel free to inspect my project architectures and GitHub repositories directly via my portfolio.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background-color:#040914;border-top:1px solid rgba(255,255,255,0.04);text-align:center;">
              <p style="margin:0 0 8px;font-size:12px;color:#64748B;">
                Michael Angelou C. Quinit · BS Information Technology (MSU-IIT)
              </p>
              <div style="font-size:11px;font-family:monospace;">
                <a href="https://github.com/mikoquinit" style="color:#FF5722;text-decoration:none;margin:0 8px;">GitHub</a> &bull;
                <a href="https://linkedin.com/in/mikoquinit" style="color:#FF5722;text-decoration:none;margin:0 8px;">LinkedIn</a> &bull;
                <a href="mailto:michaelquinit@gmail.com" style="color:#FF5722;text-decoration:none;margin:0 8px;">Direct Email</a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function internalNotificationTemplate(data: EmailData): string {
  const timestamp = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Manila',
    dateStyle: 'full',
    timeStyle: 'short',
  })

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Inquiry Alert</title>
</head>
<body style="margin:0;padding:0;background-color:#030712;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#030712;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);background-color:#071224;">
          
          <!-- Header -->
          <tr>
            <td style="padding:24px 40px;background-color:#040914;border-bottom:2px solid #FF5722;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size:13px;font-weight:bold;color:#FF5722;font-family:monospace;letter-spacing:1px;">⚡ NEW PORTFOLIO LEAD</span>
                  </td>
                  <td align="right">
                    <span style="font-size:11px;font-family:monospace;color:#64748B;">${timestamp} (PST)</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              <h1 style="margin:0 0 20px;font-size:20px;color:#FFFFFF;">
                Inquiry from <span style="color:#FF5722;">${data.name}</span>
              </h1>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:12px 16px;background-color:#040914;border-radius:8px 8px 0 0;border-bottom:1px solid rgba(255,255,255,0.04);">
                    <div style="font-size:10px;color:#64748B;font-family:monospace;text-transform:uppercase;">Sender Name</div>
                    <div style="font-size:14px;color:#FFFFFF;font-weight:600;margin-top:2px;">${data.name}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;background-color:#040914;border-bottom:1px solid rgba(255,255,255,0.04);">
                    <div style="font-size:10px;color:#64748B;font-family:monospace;text-transform:uppercase;">Email Address</div>
                    <div style="font-size:14px;margin-top:2px;">
                      <a href="mailto:${data.email}" style="color:#FF5722;text-decoration:none;font-weight:600;">${data.email}</a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;background-color:#040914;border-bottom:1px solid rgba(255,255,255,0.04);">
                    <div style="font-size:10px;color:#64748B;font-family:monospace;text-transform:uppercase;">Company / Org</div>
                    <div style="font-size:14px;color:#FFFFFF;margin-top:2px;">${data.company || '—'}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 16px;background-color:#040914;border-radius:0 0 8px 8px;">
                    <div style="font-size:10px;color:#64748B;font-family:monospace;text-transform:uppercase;margin-bottom:4px;">Message Payload</div>
                    <div style="font-size:14px;color:#CBD5E1;line-height:1.6;">${data.message}</div>
                  </td>
                </tr>
              </table>

              <!-- Reply Action -->
              <a href="mailto:${data.email}?subject=Re: Portfolio Inquiry&body=Hi ${data.name.trim().split(' ')[0]},%0D%0A%0D%0AThank you for reaching out!" 
                 style="display:inline-block;padding:12px 24px;background-color:#FF5722;color:#FFFFFF;text-decoration:none;border-radius:8px;font-size:13px;font-weight:bold;font-family:monospace;">
                Quick Direct Reply &rarr;
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px 40px;background-color:#040914;text-align:center;">
              <span style="font-size:11px;font-family:monospace;color:#475569;">
                MQ Portfolio System Notification
              </span>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
