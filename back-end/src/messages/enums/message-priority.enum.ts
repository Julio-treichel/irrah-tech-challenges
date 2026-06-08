export enum MessagePriority {
    NORMAL = 'normal',
    URGENT = 'urgent',
}

export const MESSAGE_COST: Record<MessagePriority, number> = {
    [MessagePriority.NORMAL]: 0.25,
    [MessagePriority.URGENT]: 0.5,
};
