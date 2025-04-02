//
//  SNRInjector.h
//  SyneriseSDK
//
//  Created by Synerise
//  Copyright (c) 2024 Synerise. All rights reserved.
//

@class SNRInAppMessageData;

NS_ASSUME_NONNULL_BEGIN

/**
 * @protocol SNRInjectorInAppMessageDelegate
 *
 * A delegate to handle events from in-app message campaigns.
 */

NS_SWIFT_NAME(InjectorInAppMessageDelegate)
@protocol SNRInjectorInAppMessageDelegate

@optional

/**
 * This method is called after an in-app message is loaded and Synerise SDK asks for permission to show it.
 *
 * @param data Model representation of the in-app message.
 */
- (BOOL)SNR_shouldInAppMessageAppear:(SNRInAppMessageData *)data NS_SWIFT_NAME(snr_shouldInAppMessageAppear(data:));

/**
 * This method is called after an in-app message appears.
 *
 * @param data Model representation of the in-app message.
 */
- (void)SNR_inAppMessageDidAppear:(SNRInAppMessageData *)data NS_SWIFT_NAME(snr_inAppMessageDidAppear(data:));

/**
 * This method is called after an in-app message disappears.
 *
 * @param data Model representation of the in-app message.
 */
- (void)SNR_inAppMessageDidDisappear:(SNRInAppMessageData *)data NS_SWIFT_NAME(snr_inAppMessageDidDisappear(data:));

/**
 * This method is called when an in-app message changes size.
 */
- (void)SNR_inAppMessageDidChangeSize:(CGRect)rect NS_SWIFT_NAME(snr_inAppMessageDidChangeSize(rect:));

/**
 * This method is called when a individual context for an in-app message is needed.
 *
 * @param data Model representation of the in-app message.
 */
- (nullable NSDictionary *)SNR_inAppMessageContextIsNeeded:(SNRInAppMessageData *)data NS_SWIFT_NAME(snr_inAppMessageContextIsNeeded(data:));

/**
 * This method is called when Synerise handles URL action from in-app messages.
 *
 * @param data Model representation of the in-app message.
 * @param url URL address value from the activity.
 */
- (void)SNR_inAppMessageHandledURLAction:(SNRInAppMessageData *)data url:(NSURL *)url NS_SWIFT_NAME(snr_inAppMessageHandledAction(data:url:));

/**
 * This method is called when Synerise handles deeplink action from in-app messages.
 *
 * @param data Model representation of the in-app message.
 * @param deeplink Literal text value from the activity.
 */
- (void)SNR_inAppMessageHandledDeeplinkAction:(SNRInAppMessageData *)data deeplink:(NSString *)deeplink NS_SWIFT_NAME(snr_inAppMessageHandledAction(data:deeplink:)) DEPRECATED_MSG_ATTRIBUTE("Use `snr_inAppMessageHandledAction(data:deepLink:)` instead.");

/**
 * This method is called when Synerise handles deeplink action from in-app messages.
 *
 * @param data Model representation of the in-app message.
 * @param deepLink Literal text value from the activity.
 */
- (void)SNR_inAppMessageHandledDeepLinkAction:(SNRInAppMessageData *)data deepLink:(NSString *)deepLink NS_SWIFT_NAME(snr_inAppMessageHandledAction(data:deepLink:));

/**
 * This method is called when Synerise handles custom action from in-app messages.
 *
 * @param data Model representation of the in-app message.
 * @param name Custom action name for identification.
 * @param parameters  Custom action parameters.
 */
- (void)SNR_inAppMessageHandledCustomAction:(SNRInAppMessageData *)data name:(NSString *)name parameters:(NSDictionary *)parameters NS_SWIFT_NAME(snr_inAppMessageHandledCustomAction(data:name:parameters:));

@end


/**
 * @class SNRInjector
 */

NS_SWIFT_NAME(Injector)
@interface SNRInjector : NSObject

+ (instancetype)new NS_UNAVAILABLE;
- (instancetype)init NS_UNAVAILABLE;

/**
 * This method sets an object for in-app messages delegate methods.
 *
 * @param delegate An object that implements the `SNRInAppMessageDelegate` protocol.
 */
+ (void)setInAppMessageDelegate:(id<SNRInjectorInAppMessageDelegate>)delegate;

@end

NS_ASSUME_NONNULL_END

