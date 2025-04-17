/**
 * Interface cho template thông báo
 */
export interface NotificationEmailTemplate {
  title: string;
  content: string;
  link?: string;
  imageUrl?: string;
}

/**
 * Interface cho template thông báo khóa học
 */
export interface CourseAnnouncementEmailTemplate
  extends NotificationEmailTemplate {
  courseName: string;
  instructorName: string;
}

/**
 * Interface cho template thông báo bài tập
 */
export interface AssignmentEmailTemplate extends NotificationEmailTemplate {
  courseName: string;
  assignmentTitle: string;
  dueDate: string;
}

/**
 * Interface cho template thông báo điểm số
 */
export interface GradeEmailTemplate extends NotificationEmailTemplate {
  courseName: string;
  assessmentTitle: string;
  score: number;
  maxScore: number;
  feedback?: string;
}

/**
 * Interface cho template thông báo đăng ký khóa học
 */
export interface EnrollmentEmailTemplate extends NotificationEmailTemplate {
  courseName: string;
  instructorName: string;
  startDate: string;
  endDate: string;
}

/**
 * Interface cho template thông báo chứng chỉ
 */
export interface CertificateEmailTemplate extends NotificationEmailTemplate {
  courseName: string;
  issueDate: string;
  expiryDate?: string;
  grade?: string;
}

/**
 * Interface cho template thông báo buổi học trực tuyến
 */
export interface LiveSessionEmailTemplate extends NotificationEmailTemplate {
  courseName: string;
  instructorName: string;
  startTime: string;
  duration: number;
  platform: string;
  meetingLink: string;
  meetingId?: string;
  password?: string;
}
