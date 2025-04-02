//
//  SyneriseSDK.h
//  SyneriseSDK
//
//  Created by Synerise
//  Copyright (c) 2024 Synerise. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <UserNotifications/UserNotifications.h>
#import <UserNotificationsUI/UserNotificationsUI.h>

#import <SyneriseSDK/SNRSynerise.h>

// Modules
#import <SyneriseSDK/SNRTracker.h>
#import <SyneriseSDK/SNRClient.h>
#import <SyneriseSDK/SNRContent.h>
#import <SyneriseSDK/SNRInjector.h>
#import <SyneriseSDK/SNRPromotions.h>

// API Queries & Options
#import <SyneriseSDK/SNRApiQuerySortingOrder.h>
#import <SyneriseSDK/SNRClientEventsApiQuery.h>
#import <SyneriseSDK/SNRPromotionsApiQuery.h>
#import <SyneriseSDK/SNRDocumentApiQuery.h>
#import <SyneriseSDK/SNRRecommendationOptions.h>
#import <SyneriseSDK/SNRScreenViewApiQuery.h>

// Exceptions
#import <SyneriseSDK/SNRExceptionHandler.h>
#import <SyneriseSDK/SNRException.h>
#import <SyneriseSDK/SNRInvalidArgumentException.h>
#import <SyneriseSDK/SNRInternalInconsistencyException.h>

// Errors
#import <SyneriseSDK/SNRErrorCode.h>
#import <SyneriseSDK/SNRErrorUserInfoKey.h>
#import <SyneriseSDK/SNRError.h>
#import <SyneriseSDK/SNRApiError.h>
#import <SyneriseSDK/SNRApiErrorBody.h>
#import <SyneriseSDK/SNRApiErrorCause.h>
#import <SyneriseSDK/SNRInvalidArgumentError.h>
#import <SyneriseSDK/SNRInternalInconsistencyError.h>

// Other Types
#import <SyneriseSDK/SNRLocalizableStringKey.h>
#import <SyneriseSDK/SNRPushNotificationsRegistrationOrigin.h>
#import <SyneriseSDK/SNRSyneriseSource.h>
#import <SyneriseSDK/SNRSyneriseActivity.h>
#import <SyneriseSDK/SNRHostApplicationType.h>
#import <SyneriseSDK/SNRClientSignOutMode.h>
#import <SyneriseSDK/SNRClientSessionEndReason.h>
#import <SyneriseSDK/SNRClientIdentityProvider.h>

// API Models
#import <SyneriseSDK/SNRBaseModel.h>
#import <SyneriseSDK/SNRClientAgreements.h>
#import <SyneriseSDK/SNRClientSex.h>
#import <SyneriseSDK/SNRClientRegisterAccountContext.h>
#import <SyneriseSDK/SNRClientAuthenticationContext.h>
#import <SyneriseSDK/SNRClientConditionalAuthenticationContext.h>
#import <SyneriseSDK/SNRClientSimpleAuthenticationData.h>
#import <SyneriseSDK/SNRClientConditionalAuthStatus.h>
#import <SyneriseSDK/SNRClientConditionalAuthResult.h>
#import <SyneriseSDK/SNRClientPasswordResetRequestContext.h>
#import <SyneriseSDK/SNRClientPasswordResetConfirmationContext.h>
#import <SyneriseSDK/SNRClientAccountInformation.h>
#import <SyneriseSDK/SNRClientUpdateAccountBasicInformationContext.h>
#import <SyneriseSDK/SNRClientUpdateAccountContext.h>
#import <SyneriseSDK/SNRClientEventData.h>
#import <SyneriseSDK/SNRTokenOrigin.h>
#import <SyneriseSDK/SNRToken.h>
#import <SyneriseSDK/SNRTokenPayload.h>
#import <SyneriseSDK/SNRPromotionIdentifier.h>
#import <SyneriseSDK/SNRPromotionDiscountModeDetails.h>
#import <SyneriseSDK/SNRPromotionDiscountStep.h>
#import <SyneriseSDK/SNRPromotionDiscountUsageTrigger.h>
#import <SyneriseSDK/SNRPromotionStatus.h>
#import <SyneriseSDK/SNRPromotionType.h>
#import <SyneriseSDK/SNRPromotionDiscountType.h>
#import <SyneriseSDK/SNRPromotionDiscountMode.h>
#import <SyneriseSDK/SNRPromotionDetails.h>
#import <SyneriseSDK/SNRPromotionDiscountTypeDetails.h>
#import <SyneriseSDK/SNRPromotionItemScope.h>
#import <SyneriseSDK/SNRPromotionImage.h>
#import <SyneriseSDK/SNRPromotionImageType.h>
#import <SyneriseSDK/SNRPromotion.h>
#import <SyneriseSDK/SNRPromotionResponse.h>
#import <SyneriseSDK/SNRPromotionResponseMetadata.h>
#import <SyneriseSDK/SNRVoucherCodeStatus.h>
#import <SyneriseSDK/SNRAssignVoucherResponse.h>
#import <SyneriseSDK/SNRAssignVoucherData.h>
#import <SyneriseSDK/SNRVoucherCodesResponse.h>
#import <SyneriseSDK/SNRVoucherCodesData.h>
#import <SyneriseSDK/SNRDocument.h>
#import <SyneriseSDK/SNRRecommendationResponse.h>
#import <SyneriseSDK/SNRRecommendationResponseExtras.h>
#import <SyneriseSDK/SNRRecommendationResponseExtrasSlot.h>
#import <SyneriseSDK/SNRRecommendation.h>
#import <SyneriseSDK/SNRScreenView.h>
#import <SyneriseSDK/SNRScreenViewAudienceInfo.h>
#import <SyneriseSDK/SNRInAppMessageData.h>

// Content Widget
#import <SyneriseSDK/SNRContentWidgetAppearance.h>
#import <SyneriseSDK/SNRContentWidgetLayout.h>
#import <SyneriseSDK/SNRContentWidgetHorizontalSliderLayout.h>
#import <SyneriseSDK/SNRContentWidgetGridLayout.h>
#import <SyneriseSDK/SNRContentWidgetItemLayout.h>
#import <SyneriseSDK/SNRContentWidgetBasicProductItemLayout.h>
#import <SyneriseSDK/SNRContentWidgetBadgeItemLayoutPartial.h>
#import <SyneriseSDK/SNRContentWidgetImageButtonCustomAction.h>
#import <SyneriseSDK/SNRContentWidgetOptions.h>
#import <SyneriseSDK/SNRContentWidgetRecommendationsOptions.h>
#import <SyneriseSDK/SNRContentWidgetRecommendationDataModel.h>
#import <SyneriseSDK/SNRContentWidgetBadgeDataModel.h>
#import <SyneriseSDK/SNRContentWidget.h>

// Notification Service/Content Extensions & Helpers
#import <SyneriseSDK/SNRNotificationServiceExtension.h>
#import <SyneriseSDK/SNRSingleMediaContentExtensionViewController.h>
#import <SyneriseSDK/SNRCarouselContentExtensionViewController.h>
#import <SyneriseSDK/SNRNotificationInfo.h>
