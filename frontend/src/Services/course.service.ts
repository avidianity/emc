import { CourseContract } from '../Contracts/course.contract';
import { Service } from '../Libraries/Service';

export class CourseService extends Service<CourseContract> {}

export const courseService = new CourseService('/courses');
