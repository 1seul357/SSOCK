package ssoaks.ssoak.api.auction.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;
import ssoaks.ssoak.api.auction.dto.request.ReqItemChangeDto;
import ssoaks.ssoak.api.auction.dto.request.ReqItemRegisterDto;
import ssoaks.ssoak.api.auction.dto.response.BiddingSimpleInfoDto;
import ssoaks.ssoak.api.auction.dto.response.ResItemDto;
import ssoaks.ssoak.api.auction.dto.response.ResItemSeqDto;
import ssoaks.ssoak.api.auction.entity.*;
import ssoaks.ssoak.api.auction.enums.AuctionType;
import ssoaks.ssoak.api.auction.exception.NotAllowedChangeItemException;
import ssoaks.ssoak.api.auction.repository.*;
import ssoaks.ssoak.api.member.dto.response.MemberSimpleInfoDto;
import ssoaks.ssoak.api.member.entity.Member;
import ssoaks.ssoak.api.member.service.MemberService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Transactional(readOnly = true)
@Service
@RequiredArgsConstructor
public class AuctionServiceImpl implements AuctionService {

    private final CategoryRepository categoryRepository;

    private final ItemRepository itemRepository;

    private final ItemCategoryRepository itemCategoryRepository;

    private final LikeRepository likeRepository;

    private final LikeService likeService;

    private final ImageRepository imageRepository;

    private final AwsS3Service awsS3Service;

    private final MemberService memberService;

    private final BiddingRepository biddingRepository;


    @Transactional
    @Override
    public ResItemSeqDto createItem(ReqItemRegisterDto itemRegisterRequestDto) {
        log.debug("registerItem - {}", itemRegisterRequestDto);
        Member member = memberService.getMemberByAuthentication();

        LocalDateTime startTime = null;
        LocalDateTime endTime = null;
        if (itemRegisterRequestDto.getAuctionType().equals(AuctionType.NORMAL)){
            startTime = LocalDateTime.now();
            endTime = itemRegisterRequestDto.getEndTime();
        }
        else if (itemRegisterRequestDto.getAuctionType().equals(AuctionType.LIVE)) {
            startTime = itemRegisterRequestDto.getStartTime();
            endTime = startTime.plusMinutes(30L);
        }

        Item item = Item.builder()
                .title(itemRegisterRequestDto.getTitle())
                .content(itemRegisterRequestDto.getContent())
                .startPrice(itemRegisterRequestDto.getStartPrice())
                .biddingUnit((int) Math.round(itemRegisterRequestDto.getStartPrice()*0.1))
                .biddingPrice(itemRegisterRequestDto.getStartPrice())
                .biddingCount(0)
                .startTime(startTime)
                .endTime(endTime)
                .auctionType(itemRegisterRequestDto.getAuctionType())
                .isSold(false)
                .member(member)
                .build();
        itemRepository.save(item);

        // category
        for (String cate : itemRegisterRequestDto.getItemCategories()) {
            Category category = categoryRepository.findByCategoryName(cate).get();

            ItemCategory itemCategory = ItemCategory.builder()
                    .category(category)
                    .item(item)
                    .build();
            itemCategoryRepository.save(itemCategory);
        }
        // image upload
        uploadItemImages(item, itemRegisterRequestDto.getImages());

        ResItemSeqDto itemSeqDto = ResItemSeqDto.builder()
                .itemSeq(item.getSeq())
                .auctionType(item.getAuctionType())
                .build();
        return itemSeqDto;
    }

    @Transactional
    @Override
    public void createImageTest(List<MultipartFile> itemImages) {
//        log.debug("registerItem - {}");
        Member member = memberService.getMemberByAuthentication();

        Item item = Item.builder()
                .title("testImage")
                .content("image upload Test")
                .startPrice(1000)
                .biddingUnit(100)
                .biddingPrice(1000)
                .biddingUnit(0)
                .startTime(LocalDateTime.now())
                .endTime(LocalDateTime.now())
                .auctionType(AuctionType.NORMAL)
                .isSold(false)
                .member(member)
                .build();
        itemRepository.save(item);
        uploadItemImages(item, itemImages);
    }

    @Override
    public ResItemDto getItemDetail(Long itemSeq) {
        log.debug("getItem - {}", itemSeq);
        Member member = memberService.getMemberByAuthentication();
        Item item = itemRepository.findById(itemSeq)
                .orElseThrow(() -> new IllegalArgumentException("해당 물품을 찾을 수 없습니다."));

        // category
        List<ItemCategory> itemCategories = itemCategoryRepository.findByItem(item)
                .orElseThrow(() -> new IllegalArgumentException("해당 물품에 대한 카테고리를 찾을 수 없습니다."));

        String categoryName = itemCategories.get(0).getCategory().getCategoryName();
        Integer categorySeq = itemCategories.get(0).getCategory().getSeq().intValue();

        // member
        MemberSimpleInfoDto memberDto = MemberSimpleInfoDto.builder()
                .seq(member.getSeq())
                .nickname(member.getNickname())
                .profileImageUrl(member.getProfileImageUrl())
                .build();

        // seller
        MemberSimpleInfoDto seller = MemberSimpleInfoDto.builder()
                .seq(item.getMember().getSeq())
                .nickname(item.getMember().getNickname())
                .profileImageUrl(item.getMember().getProfileImageUrl())
                .build();

        // images
        List<String> images = item.getImages().stream()
                .map(Image::getImageUrl)
                .collect(Collectors.toList());

        // bidding
        Bidding bidding = biddingRepository.findTop1ByItemSeqOrderBySeqDesc(itemSeq).orElse(null);
        BiddingSimpleInfoDto biddingDto = null;

        if (bidding != null) {
            MemberSimpleInfoDto buyer = MemberSimpleInfoDto.builder()
                    .seq(bidding.getBuyer().getSeq())
                    .nickname(bidding.getBuyer().getNickname())
                    .profileImageUrl(bidding.getBuyer().getProfileImageUrl())
                    .build();

            biddingDto = BiddingSimpleInfoDto.builder()
                    .biddingPrice(bidding.getBiddingPrice())
                    .biddingDate(bidding.getCreatedDate())
                    .biddingCount(item.getBiddingCount())
                    .buyer(buyer)
                    .build();
        }

        // like
        Boolean like = likeService.isLike(member.getSeq(), itemSeq);
        Integer cntLike = likeRepository.countLikeByItemSeq(itemSeq);

        ResItemDto resItemDto = ResItemDto.builder()
                .itemSeq(item.getSeq())
                .title(item.getTitle())
                .content(item.getContent())
                .startPrice(item.getStartPrice())
                .biddingUnit(item.getBiddingUnit())
                .startTime(item.getStartTime())
                .endTime(item.getEndTime())
                .auctionType(item.getAuctionType())
                .isSold(item.getIsSold())
                .member(memberDto)
                .isLike(like)
                .likeCount(cntLike)
                .itemCategoryName(categoryName)
                .itemCategorySeq(categorySeq)
                .itemImages(images)
                .bidding(biddingDto)
                .seller(seller)
                .build();
        return resItemDto;
    }

    @Override
    public void uploadItemImages(Item item, List<MultipartFile> itemImages) {

        itemImages.forEach(image -> {
            String imageUrl = awsS3Service.uploadImage(image);
            System.out.println("AWS -- imageUrl : " + imageUrl);
            Image imageBuild = Image.builder()
                    .imageUrl(imageUrl)
                    .item(item)
                    .build();
            imageRepository.save(imageBuild);
        });
    }

    @Transactional
    @Override
    public ResItemSeqDto changeItem(Long itemSeq, ReqItemChangeDto itemChangeDto) {
        log.debug("changeItem seq - {} itemChangeDto - {}", itemSeq, itemChangeDto);
        Member member = memberService.getMemberByAuthentication();

        Item item = itemRepository.findBySeq(itemSeq)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 물품입니다."));
        if (!(item.getMember().equals(member))) {
            throw new NotAllowedChangeItemException("본인의 경매만 수정이 가능합니다.");
        }
        System.out.println("item - " + item);
        Bidding bidding = biddingRepository.findTop1ByItemSeqOrderBySeqDesc(itemSeq).orElse(null);
        if (item.getAuctionType().equals(AuctionType.NORMAL) && !(bidding == null)) {
            throw new NotAllowedChangeItemException("이미 진행중인 경매는 수정이 불가능합니다.");
        } else if (item.getAuctionType().equals(AuctionType.LIVE) && item.getStartTime().isBefore(LocalDateTime.now())) {
            throw new NotAllowedChangeItemException("이미 진행중인 경매는 수정이 불가능합니다.");
        } else {
            // item
            item.changeItem(itemChangeDto.getTitle(), itemChangeDto.getContent(),
                    itemChangeDto.getStartPrice(), (int) Math.round(itemChangeDto.getStartPrice()*0.1),
                    itemChangeDto.getStartTime(), itemChangeDto.getEndTime(), itemChangeDto.getAuctionType());

            // category
            List<ItemCategory> categories = itemCategoryRepository.findByItem(item)
                    .orElseThrow(()-> new IllegalArgumentException("물품 카테고리 조회에 실패했습니다."));
            for (ItemCategory category : categories) {
                Category cate = categoryRepository.findByCategoryName(itemChangeDto.getItemCategories().get(0)).orElse(null);
                category.changeItemCategory(cate);
            }

            // image
            List<Image> originImageList = imageRepository.findAllByItemSeq(itemSeq);
            for (Image image : originImageList) {
                System.out.println("imageurls null이 아니면 true -> " + !CollectionUtils.isEmpty(itemChangeDto.getImageUrls()));
                if (!CollectionUtils.isEmpty(itemChangeDto.getImageUrls())){

                    List<String> imageStringList = itemChangeDto.getImageUrls();
                    System.out.println("imageUrl이 포함되어있지 않으면  true하고 delete - " + !(imageStringList.contains(image.getImageUrl())));
                    if (!(imageStringList.contains(image.getImageUrl()))) {
                        imageRepository.delete(image);
                    }
                } else {
                    imageRepository.delete(image);
                }
            }
            if(!CollectionUtils.isEmpty(itemChangeDto.getImages())) {
                System.out.println("==새로운 이미지 upload====");
                uploadItemImages(item, itemChangeDto.getImages());
            }

            ResItemSeqDto itemSeqDto = ResItemSeqDto.builder()
                    .itemSeq(itemSeq)
                    .auctionType(item.getAuctionType()).build();
            return itemSeqDto;
        }
    }

    @Transactional
    @Override
    public Boolean deleteItem(Long itemSeq) {
        log.debug("changeItem - {}", itemSeq);
        Member member = memberService.getMemberByAuthentication();

        Item item = itemRepository.findBySeq(itemSeq)
                .orElseThrow(() -> new IllegalArgumentException("물품 조회 실패 "));
        if (item.getMember().getSeq() != member.getSeq()) {
            throw new NotAllowedChangeItemException("본인의 경매만 삭제 가능합니다.");
        }

        Bidding bidding = biddingRepository.findTop1ByItemSeqOrderBySeqDesc(itemSeq).orElse(null);
        if (item.getAuctionType().equals(AuctionType.NORMAL) && !(bidding == null)) {
            throw new NotAllowedChangeItemException("이미 진행중인 경매는 삭제가 불가능합니다.");
        } else if (item.getAuctionType().equals(AuctionType.LIVE) && item.getStartTime().isBefore(LocalDateTime.now())) {
            throw new NotAllowedChangeItemException("이미 진행중인 경매는 삭제가 불가능합니다.");
        } else {
            // delete image
//            List<Image> imageList = imageRepository.findAllByItemSeq(itemSeq);
//            imageRepository.deleteAll(imageList);
            // delete likes
            List<Like> likes = likeRepository.findAllByItemSeq(itemSeq);
            likeRepository.deleteAll(likes);
            // delete category
            List<ItemCategory> itemCategories = itemCategoryRepository.findAllByItemSeq(itemSeq);
            itemCategoryRepository.deleteAll(itemCategories);
            // delete item, bidding
            itemRepository.delete(item);
            return true;
        }
    }
}