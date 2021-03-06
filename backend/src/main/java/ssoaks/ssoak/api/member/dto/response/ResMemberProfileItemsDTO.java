package ssoaks.ssoak.api.member.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import ssoaks.ssoak.api.auction.dto.response.ItemOverviewDto;

import java.util.List;

@Getter
@ToString
public class ResMemberProfileItemsDTO {

    private List<ItemOverviewDto> items;

    @Builder
    public ResMemberProfileItemsDTO(List<ItemOverviewDto> items) {
        this.items = items;
    }
}
