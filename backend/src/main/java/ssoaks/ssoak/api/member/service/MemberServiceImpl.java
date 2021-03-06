package ssoaks.ssoak.api.member.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ssoaks.ssoak.api.auction.dto.response.ItemOverviewLikedDto;
import ssoaks.ssoak.api.auction.entity.Item;
import ssoaks.ssoak.api.auction.repository.ItemRepository;
import ssoaks.ssoak.api.auction.dto.response.ItemOverviewDto;
import ssoaks.ssoak.api.auction.service.AwsS3Service;
import ssoaks.ssoak.api.member.dto.request.ReqMemberProfileChangeDto;
import ssoaks.ssoak.api.member.dto.response.ResMemberProfileDTO;
import ssoaks.ssoak.api.member.dto.response.ResOtherMemberProfileDTO;
import ssoaks.ssoak.api.member.entity.Block;
import ssoaks.ssoak.api.member.entity.Member;
import ssoaks.ssoak.api.member.exception.NotAuthenticatedMemberException;
import ssoaks.ssoak.api.member.exception.NotFoundMemberException;
import ssoaks.ssoak.api.member.repository.BlockRepository;
import ssoaks.ssoak.api.member.repository.MemberRepository;
import ssoaks.ssoak.common.util.SecurityUtil;

import java.util.List;
import java.util.Optional;

@Slf4j
@Transactional(readOnly = true)
@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService{

    private final MemberRepository memberRepository;

    private final ItemRepository itemRepository;

    private final BlockRepository blockRepository;

    private final AwsS3Service awsS3Service;

    private final AuthService authService;


    @Override
    public Member getMemberByAuthentication() {
        long id = -1L;
        Optional<String> username = SecurityUtil.getCurrentUsername();
        if (username.isPresent()) {
            id = Long.parseLong(username.get());
        }
        return memberRepository.findById(id).orElse(null);
    }

    @Override
    public ResMemberProfileDTO getMyProfile() {

        Member member;
        Long memberSeq;

        try {
            member = getMemberByAuthentication();
            memberSeq = member.getSeq();

        } catch (Exception e) {
            throw new NotAuthenticatedMemberException("MemberServiceImpl getMyProfile() ?????? ?????? ??????");
        }

        List<Long> myBlackList = blockRepository.getMyAndCommonBlackList(memberSeq);

        ResMemberProfileDTO memberProfile = new ResMemberProfileDTO(member.getSeq(), member.getEmail(),
                member.getNickname(), member.getProfileImageUrl(), member.getGrade(), myBlackList);

        return memberProfile;
    }

    @Transactional
    @Override
    public Integer changeMember(ReqMemberProfileChangeDto reqMemberProfileChangeDto) {
        Member member;
        Long memberSeq;

        try {
            member = getMemberByAuthentication();
            memberSeq = member.getSeq();
        } catch (Exception e) {
            throw new NotAuthenticatedMemberException("MemberServiceImpl changeMember() ?????? ?????? ??????");
        }

        // ???????????? ???????????? ??? ???????????????

        String newImageUrl;
        String newNickname;

        try {
            if (reqMemberProfileChangeDto.getProfileImage() != null) {
                newImageUrl = awsS3Service.uploadImage(reqMemberProfileChangeDto.getProfileImage());
            } else {
                newImageUrl = member.getProfileImageUrl();
            }

            if (reqMemberProfileChangeDto.getNickname() != null) {
                newNickname = reqMemberProfileChangeDto.getNickname();
            } else {
                newNickname = member.getNickname();
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new IllegalArgumentException("MemberServiceImpl changeMember() ????????? ?????? ??????");
        }

        // ?????? ???????????? ?????? ??????
        if (reqMemberProfileChangeDto.getNickname() == null && reqMemberProfileChangeDto.getProfileImage() == null) {
            System.out.println("MemberServiceImpl changeMember() ????????? ????????? ????????????.");
            return 202;
        }


        member.changeMember(newNickname, newImageUrl);

        return 200;
    }

    @Transactional
    @Override
    public Integer deleteMember() throws Exception {

        Member member;
        Long memberSeq;

        try {
            member = getMemberByAuthentication();
            memberSeq = member.getSeq();
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new NotAuthenticatedMemberException("MemberServiceImpl deleteMember() ?????? ?????? ??????");
        }

        try {
            String kakaoId = member.getKakaoId();
            String resKakaoId;

            // ????????? ????????? ????????????
            if (kakaoId != null) {
                System.out.println("===??????????????? ?????? ????????? ?????????: " + kakaoId);
                resKakaoId = authService.disconnectKakao(kakaoId);
                System.out.println("===??????????????? ????????? ?????????: " + resKakaoId);
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            return 503;
        }

        try {
            member.deleteMember();
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new Exception("?????? ????????? ?????? ??????");
        }

        return 200;
    }

    @Override
    public List<ItemOverviewDto> getMySellingItems() {

        Long memberSeq;
        List<ItemOverviewDto> sellingItems;

        try {
            memberSeq = getMemberByAuthentication().getSeq();
        } catch (Exception e) {
            throw new NotAuthenticatedMemberException("MemberServiceImpl getMySellingItems() ?????? ?????? ??????");
        }

        try {
            sellingItems = itemRepository.getSellingItemOverviewsByMember(memberSeq);
        } catch (Exception e) {
            throw new IllegalArgumentException("MemberServiceImpl getMySellingItems() ????????? ?????? ?????? ??????");
        }

        return sellingItems;
    }

    @Override
    public List<ItemOverviewDto> getMySoldItems() {
        Long memberSeq;
        List<ItemOverviewDto> soldItems;

        try {
            memberSeq = getMemberByAuthentication().getSeq();
        } catch (Exception e) {
            throw new NotAuthenticatedMemberException("MemberServiceImpl getMySoldItems() ???????????? ?????? ??????");
        }

        try {
            soldItems = itemRepository.getSoldItemOverviewsByMember(memberSeq);
        } catch (Exception e) {
            throw new IllegalArgumentException("MemberServiceImpl getMySoldItems() ???????????? ?????? ?????? ??????");
        }

        return soldItems;
    }

    @Override
    public List<ItemOverviewDto> getMyUnsoldItems() {

        Long memberSeq;
        List<ItemOverviewDto> unsoldItems;

        try {
            memberSeq = getMemberByAuthentication().getSeq();
        } catch (Exception e) {
            throw new NotAuthenticatedMemberException("MemberServiceImpl getMyUnsoldItems() ?????? ?????? ??????");
        }

        try {
            unsoldItems = itemRepository.getUnsoldItemOverviewsByMember(memberSeq);
        } catch (Exception e) {
            throw new IllegalArgumentException("MemberServiceImpl getMyUnsoldItems() ???????????? ?????? ?????? ??????");
        }

        return unsoldItems;
    }

    @Override
    public List<ItemOverviewDto> getMyBoughtItems() {
        Long memberSeq;
        List<ItemOverviewDto> boughtItems;

        try {
            memberSeq = getMemberByAuthentication().getSeq();
        } catch (Exception e) {
            throw new NotAuthenticatedMemberException("MemberServiceImpl getMyBoughtItems() ?????? ?????? ??????");
        }

        try {
            boughtItems = itemRepository.getBoughtItemOverviewsByMember(memberSeq);
        } catch (Exception e) {
            throw new IllegalArgumentException("MemberServiceImpl getMyBoughtItems() ????????? ?????? ?????? ??????");
        }

        return boughtItems;
    }

    @Override
    public List<ItemOverviewLikedDto> getMyLikedItems() {
        Long memberSeq;
        List<ItemOverviewLikedDto> likedItems;

        try {
            memberSeq = getMemberByAuthentication().getSeq();
        } catch (Exception e) {
            throw new NotAuthenticatedMemberException("MemberServiceImpl getMyLikedItems() ?????? ?????? ??????");
        }

        try {
            List<Long> myBlackList = blockRepository.getMyBlackList(memberSeq);
            likedItems = itemRepository.getLikedItemOverviewsByMember(memberSeq, myBlackList);
        } catch (Exception e) {
            throw new IllegalArgumentException("MemberServiceImpl getMyLikedItems() ?????? ?????? ?????? ??????");
        }

        return likedItems;
    }

    @Override
    public ResOtherMemberProfileDTO getOtherMemberProfile(Long memberSeq) {

        Member member;
        Member otherMember;

        try {
            member = getMemberByAuthentication();
            member.getSeq();
        } catch (Exception e) {
            throw new NotAuthenticatedMemberException("MemberServiceImpl getOtherMemberProfile() ?????? ?????? ??????");
        }

        otherMember = memberRepository.findBySeq(memberSeq).orElseThrow(() -> new NotFoundMemberException("????????? ?????? ??? ??????"));

        // ????????? count??? ?????? ???????????? repository ????????? ???????????? ???????????? ????????????.
        List<Item> soldItems = itemRepository.getSoldItemsByMember(memberSeq);

        ResOtherMemberProfileDTO memberProfile = new ResOtherMemberProfileDTO(otherMember.getSeq(), otherMember.getNickname(),
                otherMember.getProfileImageUrl(), otherMember.getGrade(), otherMember.getIsDeleted(), soldItems.size());

        return memberProfile;
    }

    @Override
    @Transactional
    public Integer reportMember(Long memberSeq) {
        Member reporter;
        Long reporterSeq;
        Member member;

        try {
            reporter = getMemberByAuthentication();
            reporterSeq = reporter.getSeq();
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new NotAuthenticatedMemberException("MemberServiceImpl deleteMember() ?????? ?????? ??????");
        }


        // ????????? ?????? ??????
        try {
            System.out.println("memberSeq: " + memberSeq);
            member = memberRepository.getById(memberSeq);
            System.out.println("member: " + member);
        } catch (Exception e) {
            log.error(e.getMessage());
            return 404;
        }

        // ?????? ????????????
        Block findBlock = blockRepository.findBlockByReporterSeqAndMemberSeq(reporterSeq, memberSeq).orElse(null);

        if (findBlock != null) {
            return 400;
        }

        Block block = Block.builder()
                .reporter(reporter)
                .member(member)
                .build();
        blockRepository.save(block);

        // ?????? ?????? 3??? ???????????? ?????? ????????? ??? ????????????
        Integer countBlock = blockRepository.countBlockByMemberSeq(memberSeq);
        if (countBlock >= 3) {
            member.blockMember();
        }

        return 200;
    }

    @Override
    public void test() {

        List<Long> seqs = blockRepository.getMyBlackList(6L);
        System.out.println("test==============: " + seqs);

    }

}

