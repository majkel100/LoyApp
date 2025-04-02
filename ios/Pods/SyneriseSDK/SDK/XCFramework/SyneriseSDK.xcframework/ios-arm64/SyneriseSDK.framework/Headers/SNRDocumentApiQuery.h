//
//  SNRDocumentApiQuery.h
//  SyneriseSDK
//
//  Created by Synerise
//  Copyright (c) 2024 Synerise. All rights reserved.
//

#import <SyneriseSDK/SNRRecommendationOptions.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * @class SNRDocumentApiQuery
 */

NS_SWIFT_NAME(DocumentApiQuery)
@interface SNRDocumentApiQuery : NSObject

@property (copy, nonatomic, nonnull, readonly) NSString *slug;

@property (copy, nonatomic, nullable, readwrite) NSString *productId;
@property (copy, nonatomic, nullable, readwrite) NSArray<NSString *> *itemsIds;
@property (copy, nonatomic, nullable, readwrite) NSArray<NSString *> *itemsExcluded;

@property (copy, nonatomic, nullable, readwrite) NSString *additionalFilters;
@property (assign, nonatomic, readwrite) SNRRecommendationFiltersJoinerRule filtersJoiner;
@property (copy, nonatomic, nullable, readwrite) NSString *additionalElasticFilters;
@property (assign, nonatomic, readwrite) SNRRecommendationFiltersJoinerRule elasticFiltersJoiner;

@property (copy, nonatomic, nullable, readwrite) NSArray<NSString *> *displayAttribute;
@property (assign, nonatomic, readwrite) BOOL includeContextItems;

+ (instancetype)new NS_UNAVAILABLE;
- (instancetype)init NS_UNAVAILABLE;

- (instancetype)initWithSlug:(NSString *)slug;

@end

NS_ASSUME_NONNULL_END
