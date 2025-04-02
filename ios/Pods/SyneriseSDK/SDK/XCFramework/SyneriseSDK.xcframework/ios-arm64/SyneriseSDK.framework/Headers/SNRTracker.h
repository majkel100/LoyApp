//
//  SNRTracker.h
//  SyneriseSDK
//
//  Created by Synerise
//  Copyright (c) 2024 Synerise. All rights reserved.
//

//#import <SyneriseSDK/SNRTrackerSettings.h>

@class SNREvent;

NS_ASSUME_NONNULL_BEGIN

/**
 * @protocol SNRTrackerDelegate
 *
 * A delegate to handle events from the Tracker.
 */

NS_SWIFT_NAME(TrackerDelegate)
@protocol SNRTrackerDelegate

@optional

/**
 * This method is called when the Tracker requests a location update.
 */
- (void)SNR_locationUpdateRequired NS_SWIFT_NAME(snr_locationUpdateRequired());

@end


/**
 * @class SNRTracker
 */

NS_SWIFT_NAME(Tracker)
@interface SNRTracker : NSObject

+ (instancetype)new NS_UNAVAILABLE;
- (instancetype)init NS_UNAVAILABLE;

/**
 * This method  sets an object for Tracker module delegate methods.
 *
 * @param delegate An object that implements the `SNRTrackerDelegate` protocol.
 */
+ (void)setDelegate:(id<SNRTrackerDelegate>)delegate;

/**
 * This method sets a custom identifier in the parameters of every event.
 * You can pass a custom identifier to match your customers in our database.
 *
 * @param customIdentifier Client's custom identifier.
 */
+ (void)setCustomIdentifier:(nullable NSString *)customIdentifier;

/**
 * This method sets a custom email in the parameters of every event.
 * You can pass a custom email to match your customers in our database.
 *
 * @param customEmail Client's custom email.
 */
+ (void)setCustomEmail:(nullable NSString *)customEmail;

/**
 * This method sends an event.
 * The tracker caches and enqueues all your events locally, so they all will be sent eventually.
 *
 * @param event `SNREvent` object.
 */
+ (void)send:(SNREvent *)event;

/**
 * This method forces sending the events from the queue to the server.
 *
 * @param completionHandler A block to be executed when the tracker has finished flushing events to Synerise backend, no matter the result.
 */
+ (void)flushEventsWithCompletionHandler:(nullable void (^)(void))completionHandler NS_SWIFT_NAME(flushEvents(completionHandler:));

@end

NS_ASSUME_NONNULL_END
