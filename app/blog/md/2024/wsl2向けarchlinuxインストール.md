---
title: wsl2向けarchlinuxインストール
date: 2024-08-01
tags:
  - wsl
  - windows
  - archlinux
---
## はじめに
wslが入っていない状態からarchlinuxのwslをインストール、初期設定するまでに必要な最低限のコマンドをまとめました。

## インストール
管理者権限でPowershellを起動し、wsl2をインストールします。
```
wsl --install
```
PCを再起動し、スタートメニューからubuntuを開きます。

archのbootstrapをwgetします。定期的に更新されるので、適宜[arch](https://mirrors.edge.kernel.org/archlinux/iso/latest/)で最新バージョンのファイル名を確認します。
```
wget https://mirrors.edge.kernel.org/archlinux/iso/latest/archlinux-bootstrap-2024.07.01-x86_64.tar.zst
```
展開し、ミラーリストを編集(Japan付近をコメントアウト)してから`root.x86_64`内のファイルを圧縮し、わかりやすいところに移動します。
```
apt install zstd
tar -Izstd -xvf archlinux-bootstrap-2024.07.01-x86_64.tar.zst
cd root.x86_64/
vim etc/pacman.d/mirrorlist
tar -Izstd -cvf root.tar.zst *
mv root.tar.zst /mnt/c/Users/Utyujin/root.tar.zst
```
再び管理者権限でPowershellを起動し、インポートします。この例では、`$User\Documents\wsl`下にディスクファイルがおかれます。
```
wsl --import Archlinux C:\Users\Utyujin\Documents\wsl C:\Users\Utyujin\root.tar.zst
```
これでArchlinuxが利用できるようになりました。お疲れ様でした。

## 設定
PowershellにてArchlinuxをデタッチします。
```
wsl -d Archlinux
```
起動するので、初期設定を行っていきます。
```
pacman-key --init
pacman-key --populate archlinux
useradd -m -g wheel -G users username
passwd
passwd username
sudo pacman -S vi sudo vim
visudo
```
このままだとデフォルトで起動時に`root`ユーザとなってしまうため、`/etc/wsl.conf`に設定を追加します。
```
vim /etc/wsl.conf
[user]
default=username
```
`wsl`を再起動すると、一般ユーザでログインできます。
```
wsl -t Archlinux
wsl -d Archlinux
```
## Ubuntuの削除
Archを入れたらもうUbuntuはいりませんよね？削除しましょう。
まず、Powershellにて、登録を解除します。
```
wsl --shutdown
wsl --unregister ubuntu
```
その後、設定アプリからアンインストールを選択することで、完全に削除できます。
## 参考文献
- [WSL2 のインストールとアンインストール](https://qiita.com/zakoken/items/61141df6aeae9e3f8e36#3-wsl2-%E3%81%AE%E3%82%A2%E3%83%B3%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E6%96%B9%E6%B3%95)
- [Arch on WSL 2](https://github.com/badgumby/arch-wsl?tab=readme-ov-file)
- [サクッとUbuntu (WSL)でzstd(ZStandard)を使う方法](https://qiita.com/tatsubey/items/7ec828d72659aeae8c34)
- [WSL で デフォルトユーザ を変更する方法](https://devlights.hatenablog.com/entry/2021/05/29/070000)
- [Arch on WSLを構築する](https://zenn.dev/kyoh86/articles/4bf6513aabe517)

