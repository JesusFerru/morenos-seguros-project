import { Injectable } from '@angular/core';
import { NotificationResult } from 'app/shared/presentation/components/layout/common/notifications/notifications-result';
import { Observable, ReplaySubject } from 'rxjs';
import { Notification } from '../../presentation/components/layout/common/notifications/notifications.types';
import { HttpServiceNext } from '../helpers/services/httpNext.service';

@Injectable({ providedIn: 'root' })
export class NotificationsService extends HttpServiceNext {
    private _notifications: ReplaySubject<Notification[]> = new ReplaySubject<Notification[]>(1);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for notifications
     */
    get notifications$(): Observable<Notification[]> {
        return this._notifications.asObservable();
    }

    /**
 * Setter & getter for user
 *
 * @param value
 */
    set notification(value: Notification[]) {
        // Store the value
        this._notifications.next(value);
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------


    public getNotification(): Observable<Notification[]> {
        return this.get<Notification[]>(
            '/obtain-notification-payment'
        );
    }


    updateNotification(ids: any): Observable<NotificationResult> {
        return this.put<NotificationResult>('/notification-payment', ids, true);
    }


}
