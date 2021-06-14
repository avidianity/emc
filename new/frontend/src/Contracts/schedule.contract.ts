import { CourseContract } from './course.contract';
import { MajorContract } from './major.contract';
import { ModelContract } from './model.contract';
import { SubjectContract } from './subject.contract';
import { UserContract } from './user.contract';
import { YearContract } from './year.contract';

export type ScheduleRow = {
	day: string;
	start_time: string | null;
	end_time: string | null;
};

export interface ScheduleContract extends ModelContract {
	course_id: number;
	subject_id: number;
	teacher_id: number;
	course?: CourseContract;
	subject?: SubjectContract;
	teacher?: UserContract;
	year: string;
	payload: ScheduleRow[];
	year_id: number;
	major_id?: number;
	major?: MajorContract;
	schoolyear?: YearContract;
}
