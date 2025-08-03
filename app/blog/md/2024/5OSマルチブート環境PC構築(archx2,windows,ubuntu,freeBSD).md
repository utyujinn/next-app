---
title: 5OSマルチブート環境PC構築(archx2,windows,ubuntu,freeBSD)
date: '2024-07-30'
tags:
  - archlinux
  - windows
  - ubuntu
  - freeBSD
---
## はじめに
たくさんのOSを使えると世界が広がったような気がします。私のマルチブート環境構築を一つ一つ解説していきます。説明不足な点もあるかもしれないです。ご了承ください。

## 前提
私のPCは、
- Lenovo Yoga 760 AMD Ryzen 7 5800U・16GBメモリー・512GB SSD(82N7005SJP)
です。
## USBの準備
[Universal USB Installer](https://pendrivelinux.com/universal-usb-installer-easy-as-1-2-3/)が便利です。arch,windows,ubuntu,freeBSDを入れています。

## パーティション分け
パーティションを分割していきます。`fdisk -l`でデバイス、パーティション一覧を見ることができます。発見したら、以下のようにして選択します。
```
fdisk /dev/nvme0n1
```
削除、パーティション分けを行っていきます。
- `d Enter`で削除を行えます。
- `n Enter Enter +?G Enter`で新規パーティションを好きなサイズで作ることができます。
- `t partnum num`でパーティションのタイプを変更できます。
- 全て終わったら、`p`で確認したのち、`w`で書き込むことができます。
今回は、以下のように作成します。

| num | size  | type             | num | os      |
| --- | ----- | ---------------- | --- | ------- |
| p1  | 1G    | EFI System       | 1   | none    |
| p2  | 150G  | Linux x86_64     | 23  | arch    |
| p3  | 200G  | Linux filesystem | 11  | windows |
| p4  | 50G   | Linux filesystem | 20  | arch    |
| p5  | 40G   | Linux filesystem | 20  | ubuntu  |
| p6  | 35.9G | Linux filesystem | 20  | freeBSD |

コマンドは以下のようになります。

```
d 
n Enter Enter 1G Enter
n Enter Enter +150G Enter
n Enter Enter +200G Enter
n Enter Enter +50G Enter
n Enter Enter +40G Enter
n Enter Enter +35.9G Enter
t 1 1
t 2 23
t 3 11
p
w
```

## p1_efi_systemd-boot
とりあえずEFIパーティションをフォーマットします。
```
mkfs.fat -F 32 /dev/nvme0n1p1
```
私は`systemd-boot`が好きです。EFIパーティションをマウントした後、一コマンドでインストールできます。
```
mount /dev/nvme0n1p1 /boot
bootctl install
```
ここまででリブートすると`systemd-boot`が何もエントリがない状態で入っていることが確認できます。
ローダの設定は、`boot/loader/loader.conf`で、エントリの追加は、`boot/loader/entries/*.conf`に追加することで可能です。これでEFIパーティションの準備は完了です。

## p2_arch
2つ目のパーティションにarchを入れていきます。リブートした状態からスタートします。フォーマットの後、マウントをします。
```
mkfs.ext4 /dev/nvme0n1p2
mount /dev/nvme0n1p2 /mnt
mount --mkdir /dev/nvme0n1p1 /mnt/boot
```
必須パッケージ、準必須パッケージをインストールします。
```
pacstrap -K /mnt base linux linux-firmware vi vim dhcpcd
```
最低限の設定をしていきます。p2に入って操作を行います。PC名の設定、ユーザー追加、パスワードの設定、権限設定を行います。これらができたら`exit`します。
```
arch-chroot /mnt
vim /etc/hostname #PC名書き込み
useradd -m -g wheel -G users username
passwd #rootパスワード
passwd username
visudo
exit
```
最後にブートローダの登録です。EFIパーティションをマウントしてからエントリーを追加します。パイプで書き込むと楽です。
```
blkid | grep p2 >> /boot/loader/entries/arch.conf
```
このファイルを最終的に、以下のようなファイルに編集します。
```
title Arch Linux
linux /vmlinuz-linux
initrd /initramfs-linux.img
options root=PARTUUID="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXX" rw
```
以上でうまく言っていたらrebootし、archlinuxを起動できると思います。
`loader/loader.conf`を編集すると、デフォルトでブートされるパーティションや、タイムアウトを変更できます。
```loader/loader.conf
default arch.conf
#timeout 3
```

## p3_windows
Windowsを入れます。簡単です。
1. windowsのisoを選択します。
2. UpgradeとCustomでCustomを選びます。
3. パーティション3を選んで実行
4. 進んでいくと、microsoftアカウントを求められるのでShift+F10でコンソールに`OOBE\BYPASSNRO`を入力し、バイパスします。。
systemd-bootは自動的にwindowsのパーティションを探してくれるのでエントリの追加は必要ないです。

## p4_arch2
4つ目のパーティションにarchを入れていきます。これは、p2が使えなくなった際の緊急避難用として利用します。`p2`と同じ手順を繰り返します。リブートした状態からスタートします。フォーマットの後、マウントをします。
```
mkfs.ext4 /dev/nvme0n1p4
mount /dev/nvme0n1p4 /mnt
```
必須パッケージ、準必須パッケージをインストールします。
```
pacstrap -K /mnt base linux linux-firmware vi vim dhcpcd sudo
```
最低限の設定をしていきます。p4に入って操作を行います。PC名の設定、ユーザー追加、パスワードの設定、権限設定を行います。これらができたら`exit`します。
```
arch-chroot /mnt
vim /etc/hostname #PC名書き込み
useradd -m -g wheel -G users username
passwd #rootパスワード
passwd username
visudo
exit
```
最後にブートローダの登録です。EFIパーティションをマウントしてからエントリーを追加します。パイプで書き込むと楽です。
```
blkid | grep p4 >> /boot/loader/entries/arch2.conf
```
このファイルを最終的に、以下のようなファイルに編集します。
```
title Arch Linux
linux /vmlinuz-linux
initrd /initramfs-linux.img
options root=PARTUUID="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXX" rw
```
以上でうまく言っていたらrebootし、archlinuxを起動できると思います。
## p5_ubuntu
Ubuntuを入れます。`systemd-boot`向けのブートローダの設定が少し大変です。
1. Ubuntuのisoを選択します。
2. Nextを何回も押します。
3. インストール方法でManual Installationを選択します。
4. Device for boot loader installationに`nvme0n1`を選択、`nvme0n1p5`を選択し、Change、mount pointを`\`、Used asを`Ext4`としてNextを選択します。
5. 情報を入力し、進みます。

最後にブートローダの登録です。archからファイル操作をします。`root`ユーザで`/boot/loader/entries/`に行きます。パイプで書き込むと楽です。
```
blkid | grep p5 >> /boot/loader/entries/ubuntu.conf
```
このファイルを最終的に、以下のようなファイルに編集します。
```
title Ubuntu
linux /vmlinuz
initrd /initrd.img
options root=PARTUUID="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXX" rw
```
このままでは、`vmlinux`,`initrd.img`が存在しません。`ubuntu`から持ってきます。
```
mount /dev/nvme0n1p5 /mnt
cp /mnt/boot/vmlinuz /boot/vmlinuz
cp /mnt/boot/initrd.img /boot/initrd.img
```
以上でうまく行っていたら`reboot`し、`ubuntu`を起動できると思います。
## p6_freeBSD
`freeBSD`をインストールしていきます。手順は少ないです。
1. `freeBSD`のisoを選択し、進んて行きます
2. PartitioningでManualを選択します。
3. `p6`にフォーカスをあて`d`で削除、その後`p5`にフォーカスを当てて`c`でクリエイトします。MountPointとして`/`を入力します。
4. 進んでいくとインストールできます。

最後にブートローダの登録です。archからファイル操作をします。`root`ユーザで`/boot/loader/entries/`に行きます。パイプで書き込むと楽です。
```
blkid | grep p6 >> /boot/loader/entries/freebsd.conf
```
このファイルを最終的に、以下のようなファイルに編集します。
```
title freebsd
linux /EFI/freebsd/loader.efi
options root=PARTUUID="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXX" rw
```
以上でうまく行っていたら`reboot`し、`freebsd`を起動できると思います。

## 終わりに
同じ要領でいくらでもパーティションを作成し、`systemd-boot`から起動することができます。快適なマルチブートライフを過ごしましょう！

