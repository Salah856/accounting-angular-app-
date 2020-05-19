import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';

export const listItemAnimation = trigger('listItem', [
    state('*', style({
        transform: 'scaleY(1)',
        opacity: 1,
    })),

    state('void', style({
        transform: 'scaleY(0)',
        opacity: 0,
    })),
    transition('void => *', [animate('200ms ease-in')]),
    transition('* => void', [animate('200ms ease-out')]),
]);
