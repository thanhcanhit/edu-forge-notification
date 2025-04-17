import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly resend: Resend;
  private readonly logger = new Logger(EmailService.name);
  private readonly fromEmail: string;

  constructor(private configService: ConfigService) {
    const resendApiKey = this.configService.get<string>('RESEND_API_KEY');
    this.resend = new Resend(resendApiKey);
    const fromEmailConfig = this.configService.get<string>('FROM_EMAIL');
    this.fromEmail =
      fromEmailConfig !== undefined ? fromEmailConfig : 'onboarding@resend.dev';
  }

  /**
   * Gửi email thông báo
   * @param to Địa chỉ email người nhận
   * @param subject Tiêu đề email
   * @param html Nội dung HTML của email
   * @param text Nội dung văn bản thuần của email (fallback)
   * @returns Kết quả gửi email
   */
  async sendEmail(to: string, subject: string, html: string, text?: string) {
    try {
      // Validate email address format
      if (!this.isValidEmail(to)) {
        this.logger.warn(`Invalid email format: ${to}`);
        return {
          data: null,
          error: {
            message: `Invalid email format: ${to}`,
            name: 'validation_error',
            statusCode: 400,
          },
        };
      }

      // For testing purposes, always allow Resend test email
      if (to !== 'delivered@resend.dev' && !this.isAllowedTestEmail(to)) {
        this.logger.warn(
          `Using test email instead of ${to} in development/test environment`,
        );
        to = 'delivered@resend.dev';
      }

      const data = await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject,
        html,
        text: text || this.stripHtml(html),
      });

      this.logger.log(`Email sent to ${to} with subject "${subject}"`);
      return { data, error: null };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to send email to ${to}: ${errorMessage}`,
        errorStack,
      );

      // Return structured error response instead of throwing
      return {
        data: null,
        error: {
          message: errorMessage,
          name: error instanceof Error ? error.name : 'unknown_error',
          statusCode: 500,
          stack:
            process.env.NODE_ENV === 'development' ? errorStack : undefined,
        },
      };
    }
  }

  /**
   * Gửi email thông báo từ template
   * @param to Địa chỉ email người nhận
   * @param subject Tiêu đề email
   * @param templateName Tên template
   * @param templateData Dữ liệu cho template
   * @returns Kết quả gửi email
   */
  async sendTemplateEmail(
    to: string,
    subject: string,
    templateName: string,
    templateData: Record<string, any>,
  ) {
    // Trong tương lai, chúng ta có thể sử dụng một hệ thống template thực sự
    // Hiện tại, chúng ta sẽ sử dụng các template đơn giản
    const html = this.renderTemplate(templateName, templateData);
    return this.sendEmail(to, subject, html);
  }

  /**
   * Render template đơn giản
   * @param templateName Tên template
   * @param data Dữ liệu cho template
   * @returns HTML đã được render
   */
  private renderTemplate(
    templateName: string,
    data: Record<string, any>,
  ): string {
    // Trong tương lai, chúng ta có thể sử dụng một hệ thống template thực sự như Handlebars
    // Hiện tại, chúng ta sẽ sử dụng các template đơn giản
    switch (templateName) {
      case 'notification':
        return this.renderNotificationTemplate(data);
      default:
        throw new Error(`Template "${templateName}" not found`);
    }
  }

  /**
   * Render template thông báo
   * @param data Dữ liệu cho template
   * @returns HTML đã được render
   */
  private renderNotificationTemplate(data: Record<string, any>): string {
    const { title, content, link, imageUrl } = data;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${title}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #4a86e8;
              color: white;
              padding: 10px 20px;
              border-radius: 5px 5px 0 0;
            }
            .content {
              padding: 20px;
              border: 1px solid #ddd;
              border-top: none;
              border-radius: 0 0 5px 5px;
            }
            .button {
              display: inline-block;
              background-color: #4a86e8;
              color: white;
              padding: 10px 20px;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
            }
            .footer {
              margin-top: 20px;
              font-size: 12px;
              color: #777;
              text-align: center;
            }
            img {
              max-width: 100%;
              height: auto;
              margin: 10px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>${title}</h2>
          </div>
          <div class="content">
            <p>${content}</p>
            ${imageUrl ? `<img src="${imageUrl}" alt="Notification Image">` : ''}
            ${link ? `<a href="${link}" class="button">Xem chi tiết</a>` : ''}
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} EduForge LMS. Tất cả các quyền được bảo lưu.</p>
            <p>Email này được gửi tự động, vui lòng không trả lời.</p>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Loại bỏ HTML tags từ chuỗi
   * @param html Chuỗi HTML
   * @returns Chuỗi văn bản thuần
   */
  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }

  /**
   * Kiểm tra định dạng email có hợp lệ không
   * @param email Địa chỉ email cần kiểm tra
   * @returns true nếu email hợp lệ, false nếu không
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Kiểm tra xem email có được phép sử dụng trong môi trường test không
   * @param email Địa chỉ email cần kiểm tra
   * @returns true nếu email được phép, false nếu không
   */
  private isAllowedTestEmail(email: string): boolean {
    // Trong môi trường production, cho phép tất cả các email
    if (process.env.NODE_ENV === 'production') {
      return true;
    }

    // Danh sách domain được phép trong môi trường test/development
    const allowedDomains = [
      'resend.dev',
      'example.com',
      'test.com',
      'eduforge.io.vn',
      'eduforge.com',
    ];

    // Kiểm tra xem email có thuộc domain được phép không
    return allowedDomains.some((domain) => email.endsWith(`@${domain}`));
  }
}
