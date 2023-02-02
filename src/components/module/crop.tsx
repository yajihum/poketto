import * as Slider from "@radix-ui/react-slider";
import { useRef } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.min.css";
import Button from "./ui/button";
import Modal from "./modal";

type Props = {
  src: string;
  aspect: number;
  onCrop: (img: string) => void;
  onClose: VoidFunction;
  size: {
    width: number;
    height: number;
  };
};

const CropModal = ({ src, aspect, size, onCrop, onClose }: Props) => {
  // クロッパーの器を作成
  const cropperRef = useRef<HTMLImageElement>(null);

  // クロッパー本体を格納する変数
  let cropper: Cropper;
  // 最小のズーム倍率を補完する変数
  let initialZoom: number;

  // クロッパー初期化後に実行
  const onInit = () => {
    const imageElement = cropperRef?.current as ReactCropperElement;
    // クロッパー本体を格納
    cropper = imageElement?.cropper;

    // クロッパーに読み込ませた画像情報を取得
    const imageData = cropper.getImageData();

    // 画像情報に基づいて最小ズーム倍率を格納
    initialZoom ||= imageData.width / imageData.naturalWidth;
  };

  // クロップボタンクリック時に発動
  const crop = () => {
    // 切り抜きハンドラーを実行（切り抜き結果を渡す）
    onCrop(cropper.getCroppedCanvas(size).toDataURL());

    // モーダルを閉じる
    onClose();
  };

  // ズーム倍率の変更
  const changeZoom = ([value]: number[]) => {
    // 倍率の算出
    const zoom = initialZoom * (1 + value / 100);
    // 倍率を適用
    cropper.zoomTo(zoom);
  };

  return (
    <Modal isOpen={Boolean(src)} onClose={onClose}>
      <div className="mb-4 overflow-hidden rounded-lg">
        <Cropper
          src={src} // クロップ対象の画像
          style={{ height: 400, width: 400 }} // キャンバスのサイズ
          aspectRatio={aspect} // アスペクト比
          guides={false} // ガイドを表示するか
          ref={cropperRef} // クロッパーを生成する器を指定
          ready={onInit} // 画像を読み込み、準備完了時に発動
          cropBoxMovable={false} // 切り抜きエリアを移動不可にする
          cropBoxResizable={false} // 切り抜きエリアをリサイズ不可にする
          toggleDragModeOnDblclick={false} // ダブルクリックで切り抜きモードの切り替えを不可にする
          center={false} // センターガイドを非表示にする
          viewMode={3} // 画像をキャンバス全体に拡げる形で表示
          dragMode="move" // キャンバスの画像を動かせるようにする
          autoCropArea={1} // 初期の切り抜き範囲をキャンバスに対し100%にする
          zoomOnWheel={false} // スクロールによるズームの変更を禁止する
        ></Cropper>
      </div>

      <Slider.Root
        className="relative mb-6 flex h-5 w-full items-center"
        onValueChange={changeZoom}
      >
        <Slider.Track className="relative block h-1 w-full overflow-hidden rounded-full bg-gray-400">
          <Slider.Range className="absolute block h-full bg-orange-300" />
        </Slider.Track>
        <Slider.Thumb className="block h-5 w-5 rounded-full border-orange-300 bg-orange-300 shadow" />
      </Slider.Root>

      <div className="text-center">
        <Button
          onClick={crop}
          className="rounded-2xl bg-orange-300 py-2 px-4 font-dot text-white"
        >
          トリミング
        </Button>
      </div>
    </Modal>
  );
};

export default CropModal;
