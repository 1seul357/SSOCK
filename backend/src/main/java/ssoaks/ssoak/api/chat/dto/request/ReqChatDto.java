package ssoaks.ssoak.api.chat.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ReqChatDto {
    private Long itemSeq;
    private Long sellerSeq;
    private Long buyerSeq;
    private String content;
    private Long senderSeq;

    @Builder
    public ReqChatDto(Long itemSeq, Long sellerSeq, Long buyerSeq, String content, Long senderSeq) {
        this.itemSeq = itemSeq;
        this.sellerSeq = sellerSeq;
        this.buyerSeq = buyerSeq;
        this.content = content;
        this.senderSeq = senderSeq;
    }
}
