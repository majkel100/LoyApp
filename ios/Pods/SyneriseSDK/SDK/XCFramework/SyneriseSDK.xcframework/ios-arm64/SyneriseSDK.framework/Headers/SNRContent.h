//
//  SNRContent.h
//  SyneriseSDK
//
//  Created by Synerise
//  Copyright (c) 2024 Synerise. All rights reserved.
//

@class SNRDocument;
@class SNRDocumentApiQuery;
@class SNRDocumentsApiQuery;
@class SNRRecommendationOptions;
@class SNRRecommendationResponse;
@class SNRScreenViewResponse;
@class SNRScreenView;
@class SNRScreenViewApiQuery;

NS_ASSUME_NONNULL_BEGIN

/**
 * @class SNRContent
 */

NS_SWIFT_NAME(Content)
@interface SNRContent : NSObject

+ (instancetype)new NS_UNAVAILABLE;
- (instancetype)init NS_UNAVAILABLE;

/**
 * This method generates the document that is defined for the provided slug. Inserts are processed.
 *
 * @param slug Identifies a specific document.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 */
+ (void)generateDocument:(NSString *)slug
                 success:(void (^)(SNRDocument *document))success
                 failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(generateDocument(slug:success:failure:));

/**
 * This method generates the document that is defined for parameters provided in the query object.
 *
 * @param apiQuery `SNRDocumentApiQuery` object responsible for storing all query parameters.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 */
+ (void)generateDocumentWithApiQuery:(SNRDocumentApiQuery *)apiQuery
                             success:(void (^)(SNRDocument *document))success
                             failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(generateDocument(apiQuery:success:failure:));

/**
 * This method generates recommendations that are defined for the options provided.
 *
 * @param options `SNRRecommendationOptions` object providing parameters for recommendations.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 */
+ (void)getRecommendationsV2:(SNRRecommendationOptions *)options
                     success:(void (^)(SNRRecommendationResponse *recommendationResponse))success
                     failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(getRecommendationsV2(options:success:failure:));

/**
 * This method generates a customer's highest-priority screen view campaign from the feed with the provided feed slug.
 *
 * @param feedSlug Identifies a specific screen view.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 */
+ (void)generateScreenView:(NSString *)feedSlug
                   success:(void (^)(SNRScreenView *screenView))success
                   failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(generateScreenView(feedSlug:success:failure:));

/**
 * This method generates customer's highest-priority screen view campaign that is defined for parameters provided in the query object.
 *
 * @param apiQuery `SNRScreenViewApiQuery` object responsible for storing all query parameters.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 */
+ (void)generateScreenViewWithApiQuery:(SNRScreenViewApiQuery *)apiQuery
                               success:(void (^)(SNRScreenView *screenView))success
                               failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(generateScreenView(apiQuery:success:failure:));

@end

NS_ASSUME_NONNULL_END
