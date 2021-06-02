import { MailContract } from '../Contracts/mail.contract';
import { Service } from '../Libraries/Service';

export class MailService extends Service<MailContract> {}

export const mailService = new MailService('/mails');
