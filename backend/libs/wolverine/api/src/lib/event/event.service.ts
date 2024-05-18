import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { NotificationService } from '../sns/sns.service';
import { ConfigType } from '@nestjs/config';
import { wolverineConfig } from '../config/wolverine.config';
import { PrismaService } from '../shared/prisma/prisma.service';
import { Event } from '@prisma/client';

@Injectable()
export class EventService {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly logger: LoggerService,
    @Inject(wolverineConfig.KEY)
    private readonly Cfg: ConfigType<typeof wolverineConfig>,
    private readonly prisma: PrismaService,
  ) {}
  async create(createEventInput: CreateEventInput): Promise<Event> {
    const createdEvent = await this.prisma.event.create({
      data: {
        title: createEventInput.title,
        date: new Date(createEventInput.date),
        duration: createEventInput.duration,
        userId: createEventInput.userId,
      },
    });

    // const eventTime = new Date(createEventInput.date);
    // const eventMessage = `Event "${createEventInput.title}" is scheduled for ${eventTime}.`;

    // const twentyFourHoursBefore = new Date(
    //   eventTime.getTime() - 24 * 60 * 60 * 1000,
    // );
    // const oneHourBefore = new Date(eventTime.getTime() - 60 * 60 * 1000);
    //
    // await this.notificationService.sendNotification(
    //   this.Cfg.snsTopicArn,
    //   `Reminder: ${eventMessage}`,
    // );
    // await this.notificationService.sendNotification(
    //   this.Cfg.snsTopicArn,
    //   `One hour left for ${eventMessage}`,
    // );

    return createdEvent;
  }

  findAll(userId: number): Promise<Event[]> {
    return this.prisma.event.findMany({ where: userId });
  }

  findOne(id: number): Promise<Event> {
    return this.prisma.event.findUnique({ where: { id } });
  }

  update(id: number, updateEventInput: UpdateEventInput): Promise<Event> {
    return this.prisma.event.update({ where: { id }, data: updateEventInput });
  }

  remove(id: number): Promise<Event> {
    return this.prisma.event.delete({ where: { id } });
  }
}
