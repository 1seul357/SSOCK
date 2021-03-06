package ssoaks.ssoak.api.member.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class ResMemberProfileDTO {

    private Long seq;
    private String email;
    private String nickname;
    private String profileImageUrl;
    private Double grade;
    private List<Long> blackList;

}
