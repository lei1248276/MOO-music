export interface AlbumResponse {
  products: Album[]
  code: number
}

export interface Album {
  newAlbum: boolean
  albumId: number
  albumName: string
  artistName: string
  price: number
  customPriceConfig: any
  coverUrl: string
  pubTime: number
  productId: number
  saleNum: number
  topfans: any
  albumType: number
  area: number
  artistType: number
  status: number
}
