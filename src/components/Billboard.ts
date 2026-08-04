import { FiberElement, type ReactElement, type ReactNode, type Fiber } from "@lib/react-fiber.js";
import goToLink from "@utils/goToLink.js";

export interface BillboardButton {
  buttonIndex: number;
  element: HTMLElement;
  type: string | undefined;
  leadingIconToken: string | null;
  displayString: string;
  onPress: {
    trackId ?: number | null;
    ignoreBookmark ?: boolean;
    unifiedEntity ?: any;
  };
}

export class Billboard {
  element?: HTMLElement

  _fiber?: Fiber | undefined
  _fiberRefs?: {
    standardBillboard: Fiber | undefined | null;
  }

  _domRefs?: {
    billboardActions?: HTMLElement | undefined
    billboardActionsButtons?: HTMLElement[]
  }

  billboardId?: string;

  entityId?: number;
  unifiedEntityId?: string;
  itemKey?: string;

  title?: string;
  synopsis?: { text?: string; key?: string };
  entityAttributes?: Array<string | { runtime?: number } | {
    rating?: {
      value?: string;
      maturityDescription?: string;
      specificRatingReason?: string;
      maturityLevel?: number;
      board?: string;
      boardId?: number;
      ratingId?: number;
    }
  }>;

  callouts?: Array<{ key?: string; text?: string; iconId?: string }>;

  brandImage?: { key?: string; url?: string; text?: string };
  logoImage?: { key?: string; url?: string; text?: string };

  promoVideo?: {
    computeId?: string;
    video?: { videoId?: number };
    offset?: number;
  };

  contextualArtwork?: { imageCongruenceContext?: string };
  backgroundImage?: { key?: string; url?: string; text?: string };
  dominantBackgroundColor?: string;
  verticalBackgroundImage?: { key?: string; url?: string; text?: string };
  verticalBackgroundFallback?: { key?: string; url?: string; text?: string };

  isAvailable?: boolean;
  isPlayable?: boolean;

  promotedEntityTypename?: string;
  uiLabel?: string;

  liveEventData?: {
    isSvodAvailable?: boolean;
    availabilityStartTimeMs?: number;
    availabilityEndTimeMs?: number;
  };

  bookmark?: { position?: number };

  calloutsByStateItems?: any[];
  availabilityEvidenceByState?: any[];

  buttons?: BillboardButton[];

  _isMounted: boolean = false

  constructor() {
    this.mount()
  }

  get hasLinkedElement() { return this?.element?.isConnected }
  refreshIfNeeded() { if (!this.hasLinkedElement) this.mount() }

  mount() {
    const element = document.body.querySelector(`[data-uia="billboard"]`)?.parentNode
    if (!element) { this._isMounted = false; return false } else { this._isMounted = true }

    this.element = element as HTMLElement

    this.resolveFiberReferences()
    this.resolveDomReferences()

    this.billboardId = this._fiberRefs?.standardBillboard?.memoizedProps?.billboardId;
    this.entityId = this._fiberRefs?.standardBillboard?.memoizedProps?.entityId;
    this.unifiedEntityId = this._fiberRefs?.standardBillboard?.memoizedProps?.unifiedEntityId;
    this.itemKey = this._fiberRefs?.standardBillboard?.memoizedProps?.itemKey;

    this.title = this._fiberRefs?.standardBillboard?.memoizedProps?.title;

    this.synopsis = {
      text: this._fiberRefs?.standardBillboard?.memoizedProps?.synopsis?.text,
      key: this._fiberRefs?.standardBillboard?.memoizedProps?.synopsis?.key
    };

    this.entityAttributes = this._fiberRefs?.standardBillboard?.memoizedProps?.entityAttributes?.map((attr: any) => {
      if (typeof attr === 'string') return attr;
      if (attr?.runtime !== undefined) {
        return { runtime: attr.runtime };
      }
      if (attr?.rating) {
        return {
          rating: {
            value: attr.rating.value,
            maturityDescription: attr.rating.maturityDescription,
            specificRatingReason: attr.rating.specificRatingReason,
            maturityLevel: attr.rating.maturityLevel,
            board: attr.rating.board,
            boardId: attr.rating.boardId,
            ratingId: attr.rating.ratingId
          }
        };
      }
      return attr;
    });

    this.callouts = this._fiberRefs?.standardBillboard?.memoizedProps?.callouts?.map((callout: any) => ({
      key: callout?.key,
      text: callout?.text,
      iconId: callout?.iconId
    }));

    this.brandImage = {
      key: this._fiberRefs?.standardBillboard?.memoizedProps?.brandImage?.key,
      url: this._fiberRefs?.standardBillboard?.memoizedProps?.brandImage?.url,
      text: this._fiberRefs?.standardBillboard?.memoizedProps?.brandImage?.text
    };

    this.logoImage = {
      key: this._fiberRefs?.standardBillboard?.memoizedProps?.logoImage?.key,
      url: this._fiberRefs?.standardBillboard?.memoizedProps?.logoImage?.url,
      text: this._fiberRefs?.standardBillboard?.memoizedProps?.logoImage?.text
    };

    this.promoVideo = {
      computeId: this._fiberRefs?.standardBillboard?.memoizedProps?.promoVideo?.computeId,
      video: {
        videoId: this._fiberRefs?.standardBillboard?.memoizedProps?.promoVideo?.video?.videoId
      },
      offset: this._fiberRefs?.standardBillboard?.memoizedProps?.promoVideo?.offset
    };

    this.contextualArtwork = {
      imageCongruenceContext: this._fiberRefs?.standardBillboard?.memoizedProps?.contextualArtwork?.imageCongruenceContext
    };

    this.backgroundImage = {
      key: this._fiberRefs?.standardBillboard?.memoizedProps?.backgroundImage?.key,
      url: this._fiberRefs?.standardBillboard?.memoizedProps?.backgroundImage?.url,
      text: this._fiberRefs?.standardBillboard?.memoizedProps?.backgroundImage?.text
    };

    this.dominantBackgroundColor = this._fiberRefs?.standardBillboard?.memoizedProps?.dominantBackgroundColor;

    this.verticalBackgroundImage = {
      key: this._fiberRefs?.standardBillboard?.memoizedProps?.verticalBackgroundImage?.key,
      url: this._fiberRefs?.standardBillboard?.memoizedProps?.verticalBackgroundImage?.url,
      text: this._fiberRefs?.standardBillboard?.memoizedProps?.verticalBackgroundImage?.text
    };

    this.verticalBackgroundFallback = {
      key: this._fiberRefs?.standardBillboard?.memoizedProps?.verticalBackgroundFallback?.key,
      url: this._fiberRefs?.standardBillboard?.memoizedProps?.verticalBackgroundFallback?.url,
      text: this._fiberRefs?.standardBillboard?.memoizedProps?.verticalBackgroundFallback?.text
    };

    this.isAvailable = this._fiberRefs?.standardBillboard?.memoizedProps?.isAvailable;
    this.isPlayable = this._fiberRefs?.standardBillboard?.memoizedProps?.isPlayable;

    this.promotedEntityTypename = this._fiberRefs?.standardBillboard?.memoizedProps?.promotedEntityTypename;
    this.uiLabel = this._fiberRefs?.standardBillboard?.memoizedProps?.uiLabel;

    this.liveEventData = {
      isSvodAvailable: this._fiberRefs?.standardBillboard?.memoizedProps?.liveEventData?.isSvodAvailable,
      availabilityStartTimeMs: this._fiberRefs?.standardBillboard?.memoizedProps?.liveEventData?.availabilityStartTimeMs,
      availabilityEndTimeMs: this._fiberRefs?.standardBillboard?.memoizedProps?.liveEventData?.availabilityEndTimeMs
    };

    this.bookmark = {
      position: this._fiberRefs?.standardBillboard?.memoizedProps?.bookmark?.position
    };

    this.calloutsByStateItems = this._fiberRefs?.standardBillboard?.memoizedProps?.calloutsByStateItems;
    this.availabilityEvidenceByState = this._fiberRefs?.standardBillboard?.memoizedProps?.availabilityEvidenceByState;

    this.buttons = this._domRefs?.billboardActionsButtons?.map((b, index) => {
      return {
        buttonIndex: index,
        element: b,
        type: b.dataset?.uia?.split("-").filter(f=>f).map(s=> (s[0]?.toLocaleUpperCase() + s.slice(1))).join(""),
        displayString: this._fiberRefs?.standardBillboard?.memoizedProps?.buttons?.displayString,
        leadingIconToken: this._fiberRefs?.standardBillboard?.memoizedProps?.buttons?.leadingIconToken,
        onPress: {
          trackId: this._fiberRefs?.standardBillboard?.memoizedProps?.buttons?.onPress?.trackId,
          ignoreBookmark: this._fiberRefs?.standardBillboard?.memoizedProps?.buttons?.onPress?.ignoreBookmark,
          unifiedEntity: this._fiberRefs?.standardBillboard?.memoizedProps?.buttons?.onPress?.unifiedEntity
        }
      }
    }) || []
    
    return true
  }

  private resolveDomReferences() {
    const billboardActions = this.element!.querySelector('[data-uia="billboard-actions"]') as HTMLElement | undefined
    const buttons = [...billboardActions?.querySelectorAll("span button") || []].filter((e) => e.checkVisibility()) as HTMLElement[]

    this._domRefs = {
      billboardActions,
      billboardActionsButtons: buttons
    }
  }

  private resolveFiberReferences() {
    this._fiber = this.createFiberInstance()
    this._fiberRefs = this.extractFiberRefs()
  }

  private createFiberInstance() {
    if (!this._isMounted || !this.element) return
    return new FiberElement(this.element as HTMLElement)
  }

  private extractFiberRefs() {
    if (!this._fiber) return { standardBillboard: undefined }

    return {
      standardBillboard: this._fiber?.return?.return
    }
  }

  openPlayer() {
    if (!this._isMounted) return undefined
    this.refreshIfNeeded();

    return goToLink(("/watch/" + this.entityId))
  }

  openPreviewModal() {
    if (!this._isMounted) return undefined
    this.refreshIfNeeded();

    return goToLink(("/browse?jbv=" + this.entityId))
  }
}