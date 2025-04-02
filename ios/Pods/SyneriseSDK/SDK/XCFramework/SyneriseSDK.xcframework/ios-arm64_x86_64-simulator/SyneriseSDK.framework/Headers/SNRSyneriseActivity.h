//
//  SNRSyneriseActivity.h
//  SyneriseSDK
//
//  Created by Synerise
//  Copyright (c) 2024 Synerise. All rights reserved.
//

/**
 * @enum SNRSyneriseActivity
 */

typedef NS_ENUM(NSInteger, SNRSyneriseActivity) {
    /// Simple Push campaign
    SNRSyneriseActivitySimplePush,
    
    /// In-App Message campaign
    SNRSyneriseActivityInAppMessage
    
} NS_SWIFT_NAME(SyneriseActivity) DEPRECATED_MSG_ATTRIBUTE("`SNRSyneriseActivity` is deprecated.");

/**
 * @enum SNRSyneriseActivityAction
 */

typedef NS_ENUM(NSInteger, SNRSyneriseActivityAction) {
    /// Activity should be stay on screen.
    /// Note that Simple Push disappears always by default.
    SNRSyneriseActivityActionNone,
    
    /// Activity should disappear from screen.
    SNRSyneriseActivityActionHide
    
} NS_SWIFT_NAME(SyneriseActivityAction) DEPRECATED_MSG_ATTRIBUTE("`SNRSyneriseActivityAction` is deprecated.");


typedef void (^SNRSyneriseActivityActionCompletionBlock)(void) NS_SWIFT_NAME(SyneriseActivityActionCompletionBlock) DEPRECATED_MSG_ATTRIBUTE("`SNRSyneriseActivityActionCompletionBlock` is deprecated.");;
typedef void (^SNRSyneriseActivityCompletionHandler)(SNRSyneriseActivityAction, __nullable SNRSyneriseActivityActionCompletionBlock) NS_SWIFT_NAME(SyneriseActivityCompletionHandler) DEPRECATED_MSG_ATTRIBUTE("`SNRSyneriseActivityCompletionHandler` is deprecated.");;


/**
 * @protocol SyneriseActivityNotAllowed
 *
 * A protocol to block Synerise Activities.
 * Implement this protocol in a View Controller that cannot be covered by Synerise Activity.
 */

NS_SWIFT_NAME(SyneriseActivityNotAllowed)
@protocol SNRSyneriseActivityNotAllowed

@end
