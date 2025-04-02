//
//  SNRPushNotificationsRegistrationOrigin.h
//  SyneriseSDK
//
//  Created by Synerise
//  Copyright (c) 2024 Synerise. All rights reserved.
//

/**
 * @enum SNRPushNotificationsRegistrationOrigin
 */

typedef NS_ENUM(NSUInteger, SNRPushNotificationsRegistrationOrigin) {
    SNRPushNotificationsRegistrationOriginAppStarted,
    SNRPushNotificationsRegistrationOriginClientContextChange,
    SNRPushNotificationsRegistrationOriginSecurityReason,
    SNRPushNotificationsRegistrationOriginPeriodicJob
} NS_SWIFT_NAME(PushNotificationsRegistrationOrigin);
