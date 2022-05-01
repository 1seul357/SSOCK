package ssoaks.ssoak.api.auction.repository;

import ssoaks.ssoak.api.auction.dto.response.ItemOverviewDto;

import java.util.List;

public interface ItemRepositoryCustom {

    List<ItemOverviewDto> getSellingItemsByMember(Long memberSeq);
}