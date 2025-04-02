//
//  SNRSynerise.h
//  SyneriseSDK
//
//  Created by Synerise
//  Copyright (c) 2024 Synerise. All rights reserved.
//

#import <UserNotifications/UserNotifications.h>
#import <SyneriseSDK/SNRPushNotificationsRegistrationOrigin.h>
#import <SyneriseSDK/SNRSyneriseSource.h>
#import <SyneriseSDK/SNRSyneriseActivity.h>
#import <SyneriseSDK/SNRHostApplicationType.h>
#import <SyneriseSDK/SNRNotificationInfo.h>

@class SNRSettings;
@class SNRInitializationConfig;

NS_ASSUME_NONNULL_BEGIN

FOUNDATION_EXPORT NSString * const SNRSyneriseDomain;
FOUNDATION_EXPORT NSString * const SNRSyneriseBundleIdentifier;
FOUNDATION_EXPORT NSString * const SNRSyneriseVersion;

/**
 * @protocol SNRSyneriseDelegate
 *
 * A delegate to handle actions from the Synerise SDK.
 *
 * @note Note that if optional methods are not implemented, Synerise has a default behavior only for the URL action - it's redirected to a browser.
 */

NS_SWIFT_NAME(SyneriseDelegate)
@protocol SNRSyneriseDelegate

@optional

/**
 * This method is called when the Synerise SDK is initialized.
 */
- (void)SNR_initialized NS_SWIFT_NAME(snr_initialized());

/**
 * This method is called when an error occurs while initializing the Synerise SDK.
 *
 * @param error The error that occurred.
 */
- (void)SNR_initializationError:(NSError *)error NS_SWIFT_NAME(snr_initializationError(error:));

/**
 * This method is called when Synerise needs registration for Push Notifications.
 *
 * @note You should invoke the `[SNRClient registerForPush:success:failure:]` method again.
 * @note This method is invoked when the `SNR_registerForPushNotificationsIsNeededByOrigin:` method is not implemented.
 */
- (void)SNR_registerForPushNotificationsIsNeeded NS_SWIFT_NAME(snr_registerForPushNotificationsIsNeeded());

/**
 * This method is called when Synerise needs registration for Push Notifications.
 *
 * @param origin Origin of the push notifications registration from the SDK.
 *
 * @note You should invoke the `[SNRClient registerForPush:success:failure:]` method again.
 */
- (void)SNR_registerForPushNotificationsIsNeededByOrigin:(SNRPushNotificationsRegistrationOrigin)origin NS_SWIFT_NAME(snr_registerForPushNotificationsIsNeeded(origin:));

/**
 * This method is called when Synerise handles URL action from campaign activities.
 *
 * @param url URL address value from the activity.
 *
 * @note This method is invoked when the `SNR_handledActionWithURL:source:` method is not implemented.
 */
- (void)SNR_handledActionWithURL:(NSURL *)url NS_SWIFT_NAME(snr_handledAction(url:));

/**
 * This method is called when Synerise handles URL action from campaign activities.
 *
 * @param url URL address value from the activity.
 * @param activity Identifies Synerise campaign activity (`SNRSyneriseActivity`).
 * @param completionHandler A block that should be invoked with `SNRSyneriseActivityAction` parameters and a completion block to execute.
 */
- (void)SNR_handledActionWithURL:(NSURL *)url activity:(SNRSyneriseActivity)activity completionHandler:(SNRSyneriseActivityCompletionHandler)completionHandler NS_SWIFT_NAME(snr_handledAction(url:activity:completionHandler:)) DEPRECATED_MSG_ATTRIBUTE("Use `snr_handledAction(url:activity:completionHandler:)` instead.");

/**
 * This method is called when Synerise handles URL action from campaign activities.
 *
 * @param url URL address value from the activity.
 * @param source Identifies Synerise campaign activity (`SNRSyneriseSource`).
 */
- (void)SNR_handledActionWithURL:(NSURL *)url source:(SNRSyneriseSource)source NS_SWIFT_NAME(snr_handledAction(url:source:));

/**
 * This method is called when Synerise handles deeplink action from campaign activities.
 *
 * @param deepLink Literal text value from the activity.
 *
 * @note This method will be invoked when the `SNR_handledActionWithDeepLink:source:` method is not implemented.
 */
- (void)SNR_handledActionWithDeepLink:(NSString *)deepLink NS_SWIFT_NAME(snr_handledAction(deepLink:));

/**
 * This method is called when Synerise handles deeplink action from campaign activities.
 *
 * @param deepLink Literal text value from activity.
 * @param activity Identifies Synerise campaign activity (`SNRSyneriseActivity`).
 * @param completionHandler A block that should be invoked with parameters: `SNRSyneriseActivityAction` and completion block to execute.
 */
- (void)SNR_handledActionWithDeepLink:(NSString *)deepLink activity:(SNRSyneriseActivity)activity completionHandler:(SNRSyneriseActivityCompletionHandler)completionHandler NS_SWIFT_NAME(snr_handledAction(deepLink:activity:completionHandler:)) DEPRECATED_MSG_ATTRIBUTE("Use `snr_handledAction(deepLink:activity:completionHandler:)` instead.");

/**
 * This method is called when Synerise handles deeplink action from campaign activities.
 *
 * @param deepLink Literal text value from activity.
 * @param source Identifies Synerise campaign activity (`SNRSyneriseSource`).
 */
- (void)SNR_handledActionWithDeepLink:(NSString *)deepLink source:(SNRSyneriseSource)source NS_SWIFT_NAME(snr_handledAction(deepLink:source:));

@end

/**
 * @protocol SNRNotificationDelegate
 *
 * A delegate to handle events from Synerise notifications.
 *
 * @note Note that all methods are optional.
 */

NS_SWIFT_NAME(NotificationDelegate)
@protocol SNRNotificationDelegate

@optional

/**
 * This method is called when a Synerise notification is received.
 */
- (void)SNR_notificationDidReceive:(SNRNotificationInfo *)notificationInfo NS_SWIFT_NAME(snr_notificationDidReceive(notificationInfo:));

/**
 * This method is called when a Synerise notification is dismissed.
 */
- (void)SNR_notificationDidDismiss:(SNRNotificationInfo *)notificationInfo NS_SWIFT_NAME(snr_notificationDidDismiss(notificationInfo:));

/**
 * This method is called when a Synerise notification is clicked.
 */
- (void)SNR_notificationClicked:(SNRNotificationInfo *)notificationInfo NS_SWIFT_NAME(snr_notificationClicked(notificationInfo:));

/**
 * This method is called when an action button is clicked in a Synerise notification.
 */
- (void)SNR_notificationActionButtonClicked:(SNRNotificationInfo *)notificationInfo actionButton:(NSString *)actionButton NS_SWIFT_NAME(snr_notificationClicked(notificationInfo:actionButton:));

@end

/**
 * @class SNRSynerise
 *
 * SNRSynerise is responsible for initialization the Synerise SDK and its main actions.
 */

NS_SWIFT_NAME(Synerise)
@interface SNRSynerise : NSObject

@property (class, nonatomic, nonnull, readonly) SNRSettings *settings;

+ (instancetype)new NS_UNAVAILABLE;
- (instancetype)init NS_UNAVAILABLE;

/**
 * This sets object for Synerise delegate methods.
 *
 * @param delegate An object that implement SNRSyneriseDelegate protocol.
 */
+ (void)setDelegate:(id<SNRSyneriseDelegate>)delegate;

/**
 * This sets object for notification delegate methods.
 *
 * @param delegate An object that implement SNRNotificationDelegate protocol.
 */
+ (void)setNotificationDelegate:(id<SNRNotificationDelegate>)delegate;

/**
 * This method initializes Synerise.
 *
 * @param apiKey Synerise Profile API key (formerly Client API key).
 *
 * @note This method must be called before any other Synerise SDK method and only once during the application's lifecycle.
 */
+ (void)initializeWithApiKey:(NSString *)apiKey NS_SWIFT_NAME(initialize(apiKey:));

/**
 * This method initializes Synerise SDK with custom environment settings.
 *
 * @param apiKey Synerise Profile API key (formerly Client API key).
 * @param baseUrl Synerise API custom environment base URL.
 *
 * @note This method must be called before any other Synerise SDK method and only once during the application's lifecycle.
 */
+ (void)initializeWithApiKey:(NSString *)apiKey andBaseUrl:(nullable NSString *)baseUrl NS_SWIFT_NAME(initialize(apiKey:baseUrl:));

/**
 * This method changes a Profile (formerly Client) API key dynamically.
 *
 * @param apiKey Synerise Profile API key (formerly Client API key).
 */
+ (void)changeApiKey:(NSString *)apiKey;

/**
 * This method changes a Profile (formerly Client) API key dynamically, with additional parameters.
 *
 * @param apiKey Synerise Profile API key (formerly Client API key).
 * @param config The configuration of the SDK after API key change.
 *
 * @note It can include a salt for Simple Authentication requests.
 */
+ (void)changeApiKey:(NSString *)apiKey config:(nullable SNRInitializationConfig *)config;

/**
 * This method sets the salt string for request validation.
 *
 * @param salt Synerise Profile salt string for request validation.
 */
+ (void)setRequestValidationSalt:(nullable NSString *)salt;

/**
 * This method sets the Synerise SDK host application type.
 *
 * @param type Specifies the type of the host application.
 */
+ (void)setHostApplicationType:(SNRHostApplicationType)type;

/**
 * This method sets the Synerise SDK plugin version.
 *
 * @param version Specifies the version of the Synerise SDK plugin in the host application.
 */
+ (void)setHostApplicationSDKPluginVersion:(NSString *)version;

/**
 * This method enables or disables console logs from Synerise SDK.
 *
 * @param enabled Specifies that console logs are enabled/disabled.
 *
 * @note It is not recommended to use debug mode in the release version of your application.
 */
+ (void)setDebugModeEnabled:(BOOL)enabled;

/**
 * This method enables or disables crash handling by Synerise SDK.
 * If set to true, Synerise SDK will send the `client.applicationCrashed` event with information about crash.
 *
 * @param enabled Specifies that crash handling is enabled/disabled.
 */
+ (void)setCrashHandlingEnabled:(BOOL)enabled;

/**
 * This method sets the notification categories (including Synerise categories) that your app supports.
 *
 * @param notificationCategories A set of objects containing all the actions displayed in the notification interface.
 *
 * @note All notification categories must be supported by the app to function properly.
 */
+ (void)setNotificationCategories:(NSSet<UNNotificationCategory *> *)notificationCategories NS_SWIFT_NAME(setNotificationCategories(_:)) API_AVAILABLE(ios(10.0));

/**
 * This method sets identifiers for Background Tasks processing.
 *
 * @param identifiers Identifiers for background task registered in the host appliaction.
 */
+ (void)setBackgroundTaskIdentifiers:(NSArray<NSString *> *)identifiers;

/**
 * This method verifies if a notification was sent by Synerise.
 *
 * @param userInfo Key-Value map of data.
 */
+ (BOOL)isSyneriseNotification:(NSDictionary *)userInfo;

/**
 * This method checks if notification's sender is Synerise and its kind is Simple Push.
 *
 * @param userInfo Key-Value map of data.
 */
+ (BOOL)isSyneriseSimplePush:(NSDictionary *)userInfo;

/**
 * This method checks if notification's sender is Synerise and its kind is Silent Command.
 *
 * @param userInfo Key-Value map of data.
 */
+ (BOOL)isSyneriseSilentCommand:(NSDictionary *)userInfo;

/**
 * This method checks if notification's sender is Synerise and its kind is Silent SDK Command.
 *
 * @param userInfo Key-Value map of data.
 */
+ (BOOL)isSyneriseSilentSDKCommand:(NSDictionary *)userInfo;

/**
 * This method verifies if a notification is encrypted.
 *
 * @param userInfo Key-Value map of data.
 */
+ (BOOL)isNotificationEncrypted:(NSDictionary *)userInfo;

/**
 * This method decrypts the notification payload.
 *
 * @param userInfo Key-Value map of data.
 *
 * @note If notification is not encrypted the method returns raw payload.
 * @note If notification is not decrypted successfully, the method returns nil.
 */
+ (nullable NSDictionary *)decryptNotification:(NSDictionary *)userInfo;

/**
 * This method handles a notification payload and starts activity.
 *
 * @param userInfo Key-Value map of data. Key "issuer" must be set to "Synerise" value.
 */
+ (void)handleNotification:(NSDictionary *)userInfo;

/**
 * This method handles a notification payload with a user interaction and starts activity.
 *
 * @param userInfo Key-Value map of data. Key "issuer" must be set to "Synerise" value.
 * @param actionIdentifier Identifier of action received from notification response.
 */
+ (void)handleNotification:(NSDictionary *)userInfo actionIdentifier:(nullable NSString *)actionIdentifier;

@end

NS_ASSUME_NONNULL_END
