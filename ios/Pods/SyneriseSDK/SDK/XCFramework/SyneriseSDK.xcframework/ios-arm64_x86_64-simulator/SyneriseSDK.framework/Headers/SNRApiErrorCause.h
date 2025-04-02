//
//  SNRApiErrorCause.h
//  SyneriseSDK
//
//  Created by Synerise
//  Copyright (c) 2024 Synerise. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface SNRApiErrorCause : NSObject

@property (strong, nonatomic, nullable, readonly) NSString *field;
@property (strong, nonatomic, nullable, readonly) NSString *message;
@property (assign, nonatomic, readonly) NSInteger code;
@property (strong, nonatomic, nullable, readonly) NSString *rejectedValue;

@end

NS_ASSUME_NONNULL_END
