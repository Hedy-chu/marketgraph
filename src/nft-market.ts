import {
  EIP712DomainChanged as EIP712DomainChangedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  buy as buyEvent,
  buyWithWL as buyWithWLEvent,
  listToken as listTokenEvent
} from "../generated/nftMarket/nftMarket"
import {
  EIP712DomainChanged,
  OwnershipTransferred,
  buy,
  buyWithWL,
  listToken,
  NftTracer  // 新增表
} from "../generated/schema"

export function handleEIP712DomainChanged(
  event: EIP712DomainChangedEvent
): void {
  let entity = new EIP712DomainChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlebuy(event: buyEvent): void {
  let entity = new buy(event.transaction.hash.concatI32(event.logIndex.toI32()))
  entity.seller = event.params.seller
  entity.buyer = event.params.buyer
  entity.tokenId = event.params.tokenId
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  // 新增处理内容
  let nftId = event.address.toHex() + '-' + event.params.tokenId.toString();

  // // string to bytes
  let holder = NftTracer.load(nftId);
  if (holder == null) {
    holder = new NftTracer(nftId);
  }
  holder.tokenId = event.params.tokenId;
  holder.owner = event.params.buyer;
  holder.from = event.params.seller;
  holder.save();
}

export function handlebuyWithWL(event: buyWithWLEvent): void {
  let entity = new buyWithWL(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.tokenId = event.params.tokenId
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlelistToken(event: listTokenEvent): void {
  let entity = new listToken(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.tokenId = event.params.tokenId
  entity.price = event.params.price

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()


  // 新增的内容，处理nft owner
  let nftId = event.address.toHex() + '-' + event.params.tokenId.toString();

  // // string to bytes  
  // 从原本的数据中加载
  let holder = NftTracer.load(nftId);
  if (holder == null) {
    holder = new NftTracer(nftId);
    holder.tokenId = event.params.tokenId;
    holder.owner = event.params.user;
    holder.from = event.params.user;
    holder.save();
  }
  
}
