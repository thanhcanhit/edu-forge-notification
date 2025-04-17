import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from './email.service';
import { Notification, NotificationType } from '@prisma/client';
import {
  NotificationEmailTemplate,
  CourseAnnouncementEmailTemplate,
  AssignmentEmailTemplate,
  GradeEmailTemplate,
  EnrollmentEmailTemplate,
  CertificateEmailTemplate,
  LiveSessionEmailTemplate,
} from './interfaces/email-template.interface';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

@Injectable()
export class NotificationEmailService {
  private readonly logger = new Logger(NotificationEmailService.name);

  constructor(private readonly emailService: EmailService) {}

  /**
   * Gửi thông báo qua email
   * @param notification Thông báo cần gửi
   * @param userEmail Email của người nhận
   * @returns Kết quả gửi email
   */
  async sendNotificationEmail(notification: Notification, userEmail: string) {
    try {
      const templateData = this.createTemplateData(notification);
      const subject = this.createSubject(notification);

      const result = await this.emailService.sendTemplateEmail(
        userEmail,
        subject,
        'notification',
        templateData,
      );

      if (result.error) {
        this.logger.warn(
          `Email sending warning for notification ${notification.id} to ${userEmail}: ${result.error.message}`,
        );
      } else {
        this.logger.log(
          `Email sent successfully for notification ${notification.id} to ${userEmail}`,
        );
      }

      return result;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to send notification email for notification ${notification.id}: ${errorMessage}`,
        errorStack,
      );

      // Return structured error instead of throwing
      return {
        data: null,
        error: {
          message: errorMessage,
          name: error instanceof Error ? error.name : 'unknown_error',
          statusCode: 500,
        },
      };
    }
  }

  /**
   * Tạo tiêu đề email dựa trên loại thông báo
   * @param notification Thông báo
   * @returns Tiêu đề email
   */
  private createSubject(notification: Notification): string {
    const prefix = this.getNotificationTypePrefix(notification.type);
    return `${prefix}: ${notification.title}`;
  }

  /**
   * Lấy tiền tố cho tiêu đề email dựa trên loại thông báo
   * @param type Loại thông báo
   * @returns Tiền tố
   */
  private getNotificationTypePrefix(type: NotificationType): string {
    switch (type) {
      case NotificationType.SYSTEM:
        return 'Thông báo hệ thống';
      case NotificationType.DISCUSSION:
        return 'Thảo luận';
      case NotificationType.PAYMENT:
        return 'Thanh toán';
      case NotificationType.AUTHENTICATION:
        return 'Bảo mật';
      case NotificationType.COURSE_ANNOUNCEMENT:
        return 'Thông báo khóa học';
      case NotificationType.ASSIGNMENT:
        return 'Bài tập';
      case NotificationType.GRADE:
        return 'Điểm số';
      case NotificationType.ENROLLMENT:
        return 'Đăng ký khóa học';
      case NotificationType.CERTIFICATE:
        return 'Chứng chỉ';
      case NotificationType.LIVE_SESSION:
        return 'Buổi học trực tuyến';
      default:
        return 'Thông báo';
    }
  }

  /**
   * Tạo dữ liệu cho template email dựa trên thông báo
   * @param notification Thông báo
   * @returns Dữ liệu cho template
   */
  private createTemplateData(
    notification: Notification,
  ): NotificationEmailTemplate {
    const baseTemplate: NotificationEmailTemplate = {
      title: notification.title,
      content: notification.content,
      link: notification.link || undefined,
      imageUrl: notification.image || undefined,
    };

    // Nếu không có metadata, trả về template cơ bản
    if (!notification.metadata) {
      return baseTemplate;
    }

    // Chuyển đổi metadata từ JSON sang object
    const metadata = notification.metadata as Record<string, any>;

    // Tạo template dựa trên loại thông báo
    switch (notification.type) {
      case NotificationType.COURSE_ANNOUNCEMENT:
        return this.createCourseAnnouncementTemplate(baseTemplate, metadata);
      case NotificationType.ASSIGNMENT:
        return this.createAssignmentTemplate(baseTemplate, metadata);
      case NotificationType.GRADE:
        return this.createGradeTemplate(baseTemplate, metadata);
      case NotificationType.ENROLLMENT:
        return this.createEnrollmentTemplate(baseTemplate, metadata);
      case NotificationType.CERTIFICATE:
        return this.createCertificateTemplate(baseTemplate, metadata);
      case NotificationType.LIVE_SESSION:
        return this.createLiveSessionTemplate(baseTemplate, metadata);
      default:
        return baseTemplate;
    }
  }

  /**
   * Tạo template cho thông báo khóa học
   * @param baseTemplate Template cơ bản
   * @param metadata Metadata của thông báo
   * @returns Template cho thông báo khóa học
   */
  private createCourseAnnouncementTemplate(
    baseTemplate: NotificationEmailTemplate,
    metadata: Record<string, unknown>,
  ): CourseAnnouncementEmailTemplate {
    const courseName =
      typeof metadata.courseName === 'string'
        ? metadata.courseName
        : 'Khóa học';
    const instructorName =
      typeof metadata.instructorName === 'string'
        ? metadata.instructorName
        : 'Giảng viên';

    return {
      ...baseTemplate,
      courseName,
      instructorName,
    };
  }

  /**
   * Tạo template cho thông báo bài tập
   * @param baseTemplate Template cơ bản
   * @param metadata Metadata của thông báo
   * @returns Template cho thông báo bài tập
   */
  private createAssignmentTemplate(
    baseTemplate: NotificationEmailTemplate,
    metadata: Record<string, unknown>,
  ): AssignmentEmailTemplate {
    const courseName =
      typeof metadata.courseName === 'string'
        ? metadata.courseName
        : 'Khóa học';

    const assignmentTitle =
      typeof metadata.assignmentTitle === 'string'
        ? metadata.assignmentTitle
        : 'Bài tập';

    let dueDate = 'Không có hạn nộp';
    if (
      metadata.dueDate &&
      (typeof metadata.dueDate === 'string' ||
        typeof metadata.dueDate === 'number' ||
        metadata.dueDate instanceof Date)
    ) {
      dueDate = format(new Date(metadata.dueDate), 'PPpp', { locale: vi });
    }

    return {
      ...baseTemplate,
      courseName,
      assignmentTitle,
      dueDate,
    };
  }

  /**
   * Tạo template cho thông báo điểm số
   * @param baseTemplate Template cơ bản
   * @param metadata Metadata của thông báo
   * @returns Template cho thông báo điểm số
   */
  private createGradeTemplate(
    baseTemplate: NotificationEmailTemplate,
    metadata: Record<string, unknown>,
  ): GradeEmailTemplate {
    const courseName =
      typeof metadata.courseName === 'string'
        ? metadata.courseName
        : 'Khóa học';

    const assessmentTitle =
      typeof metadata.assessmentTitle === 'string'
        ? metadata.assessmentTitle
        : 'Bài kiểm tra';

    const score = typeof metadata.score === 'number' ? metadata.score : 0;
    const maxScore =
      typeof metadata.maxScore === 'number' ? metadata.maxScore : 100;
    const feedback =
      typeof metadata.feedback === 'string' ? metadata.feedback : undefined;

    return {
      ...baseTemplate,
      courseName,
      assessmentTitle,
      score,
      maxScore,
      feedback,
    };
  }

  /**
   * Tạo template cho thông báo đăng ký khóa học
   * @param baseTemplate Template cơ bản
   * @param metadata Metadata của thông báo
   * @returns Template cho thông báo đăng ký khóa học
   */
  private createEnrollmentTemplate(
    baseTemplate: NotificationEmailTemplate,
    metadata: Record<string, unknown>,
  ): EnrollmentEmailTemplate {
    const courseName =
      typeof metadata.courseName === 'string'
        ? metadata.courseName
        : 'Khóa học';

    const instructorName =
      typeof metadata.instructorName === 'string'
        ? metadata.instructorName
        : 'Giảng viên';

    let startDate = 'Chưa xác định';
    if (
      metadata.startDate &&
      (typeof metadata.startDate === 'string' ||
        typeof metadata.startDate === 'number' ||
        metadata.startDate instanceof Date)
    ) {
      startDate = format(new Date(metadata.startDate), 'PPP', { locale: vi });
    }

    let endDate = 'Chưa xác định';
    if (
      metadata.endDate &&
      (typeof metadata.endDate === 'string' ||
        typeof metadata.endDate === 'number' ||
        metadata.endDate instanceof Date)
    ) {
      endDate = format(new Date(metadata.endDate), 'PPP', { locale: vi });
    }

    return {
      ...baseTemplate,
      courseName,
      instructorName,
      startDate,
      endDate,
    };
  }

  /**
   * Tạo template cho thông báo chứng chỉ
   * @param baseTemplate Template cơ bản
   * @param metadata Metadata của thông báo
   * @returns Template cho thông báo chứng chỉ
   */
  private createCertificateTemplate(
    baseTemplate: NotificationEmailTemplate,
    metadata: Record<string, unknown>,
  ): CertificateEmailTemplate {
    const courseName =
      typeof metadata.courseName === 'string'
        ? metadata.courseName
        : 'Khóa học';

    let issueDate = format(new Date(), 'PPP', { locale: vi });
    if (
      metadata.issueDate &&
      (typeof metadata.issueDate === 'string' ||
        typeof metadata.issueDate === 'number' ||
        metadata.issueDate instanceof Date)
    ) {
      issueDate = format(new Date(metadata.issueDate), 'PPP', { locale: vi });
    }

    let expiryDate: string | undefined = undefined;
    if (
      metadata.expiryDate &&
      (typeof metadata.expiryDate === 'string' ||
        typeof metadata.expiryDate === 'number' ||
        metadata.expiryDate instanceof Date)
    ) {
      expiryDate = format(new Date(metadata.expiryDate), 'PPP', { locale: vi });
    }

    const grade =
      typeof metadata.grade === 'string' ? metadata.grade : undefined;

    return {
      ...baseTemplate,
      courseName,
      issueDate,
      expiryDate,
      grade,
    };
  }

  /**
   * Tạo template cho thông báo buổi học trực tuyến
   * @param baseTemplate Template cơ bản
   * @param metadata Metadata của thông báo
   * @returns Template cho thông báo buổi học trực tuyến
   */
  private createLiveSessionTemplate(
    baseTemplate: NotificationEmailTemplate,
    metadata: Record<string, unknown>,
  ): LiveSessionEmailTemplate {
    const courseName =
      typeof metadata.courseName === 'string'
        ? metadata.courseName
        : 'Khóa học';

    const instructorName =
      typeof metadata.instructorName === 'string'
        ? metadata.instructorName
        : 'Giảng viên';

    let startTime = 'Chưa xác định';
    if (
      metadata.startTime &&
      (typeof metadata.startTime === 'string' ||
        typeof metadata.startTime === 'number' ||
        metadata.startTime instanceof Date)
    ) {
      startTime = format(new Date(metadata.startTime), 'PPpp', { locale: vi });
    }

    const duration =
      typeof metadata.duration === 'number' ? metadata.duration : 60;
    const platform =
      typeof metadata.platform === 'string' ? metadata.platform : 'Zoom';
    const meetingLink =
      typeof metadata.meetingLink === 'string' ? metadata.meetingLink : '#';
    const meetingId =
      typeof metadata.meetingId === 'string' ? metadata.meetingId : undefined;
    const password =
      typeof metadata.password === 'string' ? metadata.password : undefined;

    return {
      ...baseTemplate,
      courseName,
      instructorName,
      startTime,
      duration,
      platform,
      meetingLink,
      meetingId,
      password,
    };
  }
}
