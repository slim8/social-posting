
import { trigger, style, animate, transition } from '@angular/animations';

export const AccountsManagementAnimations = trigger(
    'accountsManagementAnimation',
    [
        transition(
            ':enter',
            [
                style({ height: 0, opacity: 0 }),
                animate('1s ease-out',
                    style({ height: 300, opacity: 1 }))
            ]
        ),
        transition(
            ':leave',
            [
                style({ height: 300, opacity: 1 }),
                animate('1s ease-in',
                    style({ height: 0, opacity: 0 }))
            ]
        )
    ]
)
