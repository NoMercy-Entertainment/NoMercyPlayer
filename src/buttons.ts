import type { VideoPlayerOptions } from './buckyplayer.d';


export const buttonBaseStyle = [
	'flex',
	'items-center',
	'justify-center',
	'h-10',
	'w-10',
];

export interface Icons {
    [key: string]: string
};
export const fluentIcons: Icons = {
	back: 'M10.7327 19.7905C11.0326 20.0762 11.5074 20.0646 11.7931 19.7647C12.0787 19.4648 12.0672 18.99 11.7673 18.7043L5.51587 12.7497L20.25 12.7497C20.6642 12.7497 21 12.4139 21 11.9997C21 11.5855 20.6642 11.2497 20.25 11.2497L5.51577 11.2497L11.7673 5.29502C12.0672 5.00933 12.0787 4.5346 11.7931 4.23467C11.5074 3.93475 11.0326 3.9232 10.7327 4.20889L3.31379 11.2756C3.14486 11.4365 3.04491 11.6417 3.01393 11.8551C3.00479 11.9019 3 11.9503 3 11.9997C3 12.0493 3.00481 12.0977 3.01398 12.1446C3.04502 12.3579 3.14496 12.563 3.31379 12.7238L10.7327 19.7905Z',
	subtitles: 'M18.75 4C20.5449 4 22 5.45507 22 7.25V16.7546C22 18.5495 20.5449 20.0046 18.75 20.0046H5.25C3.45507 20.0046 2 18.5495 2 16.7546V7.25C2 5.51697 3.35645 4.10075 5.06558 4.00514L5.25 4H18.75ZM10.6216 8.59854C8.21322 7.22469 5.5 8.85442 5.5 12C5.5 15.1433 8.21539 16.7747 10.6208 15.4066C10.9809 15.2018 11.1067 14.7439 10.9019 14.3838C10.6971 14.0238 10.2392 13.8979 9.8792 14.1027C8.48411 14.8962 7 14.0046 7 12C7 9.99357 8.48071 9.10417 9.87838 9.90146C10.2382 10.1067 10.6962 9.98141 10.9015 9.62162C11.1067 9.26183 10.9814 8.80378 10.6216 8.59854ZM18.1216 8.59854C15.7132 7.22469 13 8.85442 13 12C13 15.1433 15.7154 16.7747 18.1208 15.4066C18.4809 15.2018 18.6067 14.7439 18.4019 14.3838C18.1971 14.0238 17.7392 13.8979 17.3792 14.1027C15.9841 14.8962 14.5 14.0046 14.5 12C14.5 9.99357 15.9807 9.10417 17.3784 9.90146C17.7382 10.1067 18.1962 9.98141 18.4015 9.62162C18.6067 9.26183 18.4814 8.80378 18.1216 8.59854Z',
	subtitlesHover: 'M18.75 4C20.5449 4 22 5.45507 22 7.25V16.7546C22 18.5495 20.5449 20.0046 18.75 20.0046H5.25C3.45507 20.0046 2 18.5495 2 16.7546V7.25C2 5.51697 3.35645 4.10075 5.06558 4.00514L5.25 4H18.75ZM18.75 5.5H5.25L5.10647 5.5058C4.20711 5.57881 3.5 6.33183 3.5 7.25V16.7546C3.5 17.7211 4.2835 18.5046 5.25 18.5046H18.75C19.7165 18.5046 20.5 17.7211 20.5 16.7546V7.25C20.5 6.2835 19.7165 5.5 18.75 5.5ZM5.5 12C5.5 8.85442 8.21322 7.22469 10.6216 8.59854C10.9814 8.80378 11.1067 9.26183 10.9015 9.62162C10.6962 9.98141 10.2382 10.1067 9.87838 9.90146C8.48071 9.10417 7 9.99357 7 12C7 14.0046 8.48411 14.8962 9.8792 14.1027C10.2392 13.8979 10.6971 14.0238 10.9019 14.3838C11.1067 14.7439 10.9809 15.2018 10.6208 15.4066C8.21539 16.7747 5.5 15.1433 5.5 12ZM13 12C13 8.85442 15.7132 7.22469 18.1216 8.59854C18.4814 8.80378 18.6067 9.26183 18.4015 9.62162C18.1962 9.98141 17.7382 10.1067 17.3784 9.90146C15.9807 9.10417 14.5 9.99357 14.5 12C14.5 14.0046 15.9841 14.8962 17.3792 14.1027C17.7392 13.8979 18.1971 14.0238 18.4019 14.3838C18.6067 14.7439 18.4809 15.2018 18.1208 15.4066C15.7154 16.7747 13 15.1433 13 12Z',
	checkmark: 'M8.5 16.5858L4.70711 12.7929C4.31658 12.4024 3.68342 12.4024 3.29289 12.7929C2.90237 13.1834 2.90237 13.8166 3.29289 14.2071L7.79289 18.7071C8.18342 19.0976 8.81658 19.0976 9.20711 18.7071L20.2071 7.70711C20.5976 7.31658 20.5976 6.68342 20.2071 6.29289C19.8166 5.90237 19.1834 5.90237 18.7929 6.29289L8.5 16.5858Z',
	chevronL: 'M15.5303 4.21967C15.8232 4.51256 15.8232 4.98744 15.5303 5.28033L8.81066 12L15.5303 18.7197C15.8232 19.0126 15.8232 19.4874 15.5303 19.7803C15.2374 20.0732 14.7626 20.0732 14.4697 19.7803L7.21967 12.5303C6.92678 12.2374 6.92678 11.7626 7.21967 11.4697L14.4697 4.21967C14.7626 3.92678 15.2374 3.92678 15.5303 4.21967Z',
	chevronR: 'M8.46967 4.21967C8.17678 4.51256 8.17678 4.98744 8.46967 5.28033L15.1893 12L8.46967 18.7197C8.17678 19.0126 8.17678 19.4874 8.46967 19.7803C8.76256 20.0732 9.23744 20.0732 9.53033 19.7803L16.7803 12.5303C17.0732 12.2374 17.0732 11.7626 16.7803 11.4697L9.53033 4.21967C9.23744 3.92678 8.76256 3.92678 8.46967 4.21967Z',
	close: 'M4.39705 4.55379L4.46967 4.46967C4.73594 4.2034 5.1526 4.1792 5.44621 4.39705L5.53033 4.46967L12 10.939L18.4697 4.46967C18.7626 4.17678 19.2374 4.17678 19.5303 4.46967C19.8232 4.76256 19.8232 5.23744 19.5303 5.53033L13.061 12L19.5303 18.4697C19.7966 18.7359 19.8208 19.1526 19.6029 19.4462L19.5303 19.5303C19.2641 19.7966 18.8474 19.8208 18.5538 19.6029L18.4697 19.5303L12 13.061L5.53033 19.5303C5.23744 19.8232 4.76256 19.8232 4.46967 19.5303C4.17678 19.2374 4.17678 18.7626 4.46967 18.4697L10.939 12L4.46967 5.53033C4.2034 5.26406 4.1792 4.8474 4.39705 4.55379L4.46967 4.46967L4.39705 4.55379Z',
	exitFullscreen: 'M21.7776 2.22205C22.0437 2.48828 22.0679 2.90495 21.8503 3.19858L21.7778 3.28271L15.555 9.50644L21.2476 9.50739C21.6273 9.50739 21.9411 9.78954 21.9908 10.1556L21.9976 10.2574C21.9976 10.6371 21.7155 10.9509 21.3494 11.0005L21.2476 11.0074L13.6973 11.005L13.6824 11.0038C13.6141 10.9986 13.5486 10.984 13.487 10.9614L13.3892 10.9159C13.1842 10.8058 13.037 10.6023 13.0034 10.3623L12.9961 10.2574V2.7535C12.9961 2.33929 13.3319 2.0035 13.7461 2.0035C14.1258 2.0035 14.4396 2.28565 14.4893 2.65173L14.4961 2.7535L14.496 8.44444L20.7178 2.22217C21.0104 1.92925 21.4849 1.92919 21.7776 2.22205ZM11.0025 13.7547V21.2586C11.0025 21.6728 10.6667 22.0086 10.2525 22.0086C9.8728 22.0086 9.55901 21.7265 9.50935 21.3604L9.5025 21.2586L9.502 15.5634L3.28039 21.7794C2.98753 22.0723 2.51266 22.0724 2.21973 21.7795C1.95343 21.5133 1.92918 21.0966 2.147 20.803L2.21961 20.7189L8.44 14.5044L2.75097 14.5047C2.37128 14.5047 2.05748 14.2226 2.00782 13.8565L2.00097 13.7547C2.00097 13.3405 2.33676 13.0047 2.75097 13.0047L10.3053 13.0066L10.3788 13.0153L10.4763 13.0387L10.5291 13.0574L10.6154 13.0982L10.7039 13.1557C10.7598 13.1979 10.8095 13.2477 10.8517 13.3035L10.9185 13.4095L10.9592 13.503L10.9806 13.5739L10.9919 13.6286L10.998 13.6864L10.9986 13.678L11.0025 13.7547Z',
	fullscreen: 'M12.748 3.00122L20.3018 3.00173L20.402 3.01565L20.5009 3.04325L20.562 3.06918C20.641 3.10407 20.7149 3.1546 20.7798 3.21953L20.8206 3.26357L20.8811 3.34505L20.9183 3.41008L20.957 3.50039L20.9761 3.56452L20.9897 3.62846L20.999 3.72165L20.9996 11.2551C20.9996 11.6693 20.6638 12.0051 20.2496 12.0051C19.8699 12.0051 19.5561 11.723 19.5064 11.3569L19.4996 11.2551L19.499 5.55922L5.55905 19.5042L11.2496 19.5051C11.6293 19.5051 11.9431 19.7873 11.9927 20.1533L11.9996 20.2551C11.9996 20.6348 11.7174 20.9486 11.3513 20.9983L11.2496 21.0051L3.71372 21.0043L3.68473 21.0015C3.61867 20.9969 3.55596 20.983 3.49668 20.9619L3.40655 20.923L3.38936 20.9125C3.18516 20.8021 3.03871 20.5991 3.00529 20.3597L2.99805 20.2551V12.7512C2.99805 12.337 3.33383 12.0012 3.74805 12.0012C4.12774 12.0012 4.44154 12.2834 4.4912 12.6495L4.49805 12.7512V18.4432L18.438 4.50022L12.748 4.50122C12.3684 4.50122 12.0546 4.21907 12.0049 3.85299L11.998 3.75122C11.998 3.37152 12.2802 3.05773 12.6463 3.00807L12.748 3.00122Z',
	home: 'M10.5495 2.53189C11.3874 1.82531 12.6126 1.82531 13.4505 2.5319L20.2005 8.224C20.7074 8.65152 21 9.2809 21 9.94406V19.7468C21 20.7133 20.2165 21.4968 19.25 21.4968H15.75C14.7835 21.4968 14 20.7133 14 19.7468V14.2468C14 14.1088 13.8881 13.9968 13.75 13.9968H10.25C10.1119 13.9968 9.99999 14.1088 9.99999 14.2468V19.7468C9.99999 20.7133 9.2165 21.4968 8.25 21.4968H4.75C3.7835 21.4968 3 20.7133 3 19.7468V9.94406C3 9.2809 3.29255 8.65152 3.79952 8.224L10.5495 2.53189ZM12.4835 3.6786C12.2042 3.44307 11.7958 3.44307 11.5165 3.6786L4.76651 9.37071C4.59752 9.51321 4.5 9.72301 4.5 9.94406V19.7468C4.5 19.8849 4.61193 19.9968 4.75 19.9968H8.25C8.38807 19.9968 8.49999 19.8849 8.49999 19.7468V14.2468C8.49999 13.2803 9.2835 12.4968 10.25 12.4968H13.75C14.7165 12.4968 15.5 13.2803 15.5 14.2468V19.7468C15.5 19.8849 15.6119 19.9968 15.75 19.9968H19.25C19.3881 19.9968 19.5 19.8849 19.5 19.7468V9.94406C19.5 9.72301 19.4025 9.51321 19.2335 9.37071L12.4835 3.6786Z',
	language: 'M16.9613 5.98651C17.0918 5.5934 16.8789 5.16892 16.4858 5.0384C16.0927 4.90789 15.6682 5.12078 15.5377 5.51389C15.3898 5.95938 15.2337 6.55385 15.1181 7.02636C14.3819 7.05155 13.6725 7.04441 13.0512 7.00192C12.638 6.97366 12.28 7.28575 12.2518 7.699C12.2235 8.11224 12.5356 8.47016 12.9489 8.49842C13.512 8.53693 14.1391 8.54883 14.7931 8.53567C14.6493 9.30134 14.5518 9.98483 14.4928 10.5995C13.2779 11.2419 12.4318 12.1041 11.9543 13.0119C11.3412 14.1776 11.2937 15.5683 12.1596 16.4547C12.7313 17.0391 13.5679 17.095 14.2889 16.9402C14.6945 16.8532 15.1145 16.6919 15.5292 16.466C15.5352 16.4817 15.5411 16.4972 15.5468 16.5125C15.6917 16.9005 16.1237 17.0977 16.5118 16.9529C16.8998 16.808 17.097 16.376 16.9522 15.9879C16.8956 15.8363 16.8385 15.6966 16.7818 15.5641C17.8051 14.6283 18.6965 13.2557 19.0671 11.5174C19.7047 11.8294 20.1363 12.3529 20.345 12.9166C20.5723 13.5303 20.5579 14.229 20.2479 14.8693C19.9403 15.5047 19.3154 16.1338 18.2327 16.5502C17.8461 16.6988 17.6532 17.1327 17.8018 17.5194C17.9505 17.906 18.3844 18.0989 18.771 17.9502C20.1576 17.4171 21.1017 16.548 21.598 15.523C22.0918 14.5031 22.116 13.3795 21.7517 12.3957C21.3384 11.2798 20.4512 10.3853 19.2474 9.97202C19.2492 9.89857 19.2501 9.82462 19.2501 9.75018C19.2501 9.33597 18.9143 9.00018 18.5001 9.00018C18.0948 9.00018 17.7646 9.32169 17.7506 9.72358C17.2257 9.71943 16.6655 9.79437 16.0784 9.9614C16.1416 9.50583 16.2261 9.00765 16.3354 8.46137C17.5197 8.37197 18.6989 8.20879 19.6716 7.98029C20.0748 7.88556 20.3249 7.48188 20.2302 7.07865C20.1354 6.67541 19.7317 6.42532 19.3285 6.52005C18.5605 6.70047 17.6387 6.83792 16.6905 6.9262C16.7765 6.59639 16.8719 6.25572 16.9613 5.98651ZM13.2819 13.7102C13.5082 13.2799 13.8817 12.8238 14.4278 12.4104C14.4449 12.9015 14.4933 13.3357 14.5646 13.7275C14.6589 14.2462 14.8005 14.7013 14.9508 15.0998C14.6455 15.2711 14.3192 15.3996 13.9741 15.4736C13.4893 15.5777 13.2868 15.462 13.2317 15.4057C12.9929 15.1612 12.8383 14.5535 13.2819 13.7102ZM17.5959 11.2226C17.3869 12.1893 16.8955 13.2447 16.1823 14.0708C16.1295 13.8871 16.0817 13.6863 16.0404 13.4591C15.9513 12.9695 15.9006 12.3672 15.9286 11.593C16.0381 11.551 16.1511 11.5106 16.2676 11.4721C16.7491 11.3132 17.1924 11.2353 17.5959 11.2226ZM7.96084 6.53004C5.72117 5.87843 3.95773 6.68117 3.38512 6.99715C3.02245 7.19727 2.89069 7.65349 3.09081 8.01616C3.29093 8.37882 3.74715 8.51059 4.10982 8.31047C4.51469 8.08705 5.84606 7.47728 7.54098 7.97008C8.31403 8.19709 8.63905 8.60925 8.80538 9.02611C8.93783 9.35807 8.97952 9.71701 8.99259 10.0683C8.72336 9.99308 8.41199 9.91829 8.07049 9.85759C6.93793 9.65631 5.38792 9.59496 3.94794 10.2847C2.36169 11.0445 1.81748 12.601 2.04591 13.9817C2.27037 15.3384 3.26232 16.6483 4.84609 16.9333C6.2756 17.1906 7.65146 16.6774 8.60343 16.1719C8.74209 16.0983 8.87408 16.0236 8.9985 15.9496V16.2502C8.9985 16.6644 9.33429 17.0002 9.7485 17.0002C10.1627 17.0002 10.4985 16.6644 10.4985 16.2502L10.4985 10.4605C10.4988 10.0064 10.4993 9.22388 10.1986 8.47022C9.86774 7.64108 9.19434 6.89191 7.96246 6.53051L7.96084 6.53004ZM7.80802 11.3344C8.29139 11.4204 8.70564 11.5403 8.9985 11.6388V14.1448C8.96621 14.1693 8.93112 14.1955 8.89337 14.2231C8.6526 14.3993 8.3091 14.6298 7.89995 14.8471C7.05912 15.2936 6.0502 15.6259 5.11177 15.457C4.26739 15.3051 3.66714 14.5912 3.52579 13.7369C3.3884 12.9064 3.70477 12.0644 4.59594 11.6375C5.63338 11.1406 6.82165 11.1591 7.80802 11.3344Z',
	next: 'M3 4.753C3 3.34519 4.57781 2.51363 5.73916 3.30937L16.2376 10.5028C17.2478 11.1949 17.253 12.6839 16.2477 13.3831L5.7492 20.6847C4.58887 21.4917 3 20.6613 3 19.248V4.753ZM4.89131 4.54677C4.7254 4.43309 4.5 4.55189 4.5 4.753V19.248C4.5 19.4499 4.72698 19.5685 4.89274 19.4532L15.3912 12.1517C15.5348 12.0518 15.5341 11.8391 15.3898 11.7402L4.89131 4.54677ZM20.9999 3.75C20.9999 3.33579 20.6641 3 20.2499 3C19.8357 3 19.4999 3.33579 19.4999 3.75V20.25C19.4999 20.6642 19.8357 21 20.2499 21C20.6641 21 20.9999 20.6642 20.9999 20.25V3.75Z',
	pause: 'M6.25 3C5.00736 3 4 4.00736 4 5.25V18.75C4 19.9926 5.00736 21 6.25 21H8.75C9.99264 21 11 19.9926 11 18.75V5.25C11 4.00736 9.99264 3 8.75 3H6.25ZM5.5 5.25C5.5 4.83579 5.83579 4.5 6.25 4.5H8.75C9.16421 4.5 9.5 4.83579 9.5 5.25V18.75C9.5 19.1642 9.16421 19.5 8.75 19.5H6.25C5.83579 19.5 5.5 19.1642 5.5 18.75V5.25ZM15.25 3C14.0074 3 13 4.00736 13 5.25V18.75C13 19.9926 14.0074 21 15.25 21H17.75C18.9926 21 20 19.9926 20 18.75V5.25C20 4.00736 18.9926 3 17.75 3H15.25ZM14.5 5.25C14.5 4.83579 14.8358 4.5 15.25 4.5H17.75C18.1642 4.5 18.5 4.83579 18.5 5.25V18.75C18.5 19.1642 18.1642 19.5 17.75 19.5H15.25C14.8358 19.5 14.5 19.1642 14.5 18.75V5.25Z',
	pip: 'M2 6.25C2 4.45507 3.45507 3 5.25 3H18.75C20.5449 3 22 4.45507 22 6.25V12H20.5V6.25C20.5 5.2835 19.7165 4.5 18.75 4.5H5.25C4.2835 4.5 3.5 5.2835 3.5 6.25V15.75C3.5 16.7165 4.2835 17.5 5.25 17.5H11V19H5.25C3.45507 19 2 17.5449 2 15.75V6.25ZM14 13C12.8954 13 12 13.8954 12 15V20C12 21.1046 12.8954 22 14 22H21C22.1046 22 23 21.1046 23 20V15C23 13.8954 22.1046 13 21 13H14Z',
	play: 'M7.60846 4.61586C7.1087 4.34394 6.5 4.7057 6.5 5.27466V18.727C6.5 19.2959 7.1087 19.6577 7.60846 19.3858L19.97 12.6596C20.4921 12.3755 20.4921 11.6261 19.97 11.342L7.60846 4.61586ZM5 5.27466C5 3.5678 6.82609 2.48249 8.32538 3.29828L20.687 10.0244C22.2531 10.8766 22.2531 13.125 20.687 13.9772L8.32538 20.7033C6.82609 21.5191 5 20.4338 5 18.727V5.27466Z',
	playlist: 'M8 7.7518V13.249C8 13.8419 8.65544 14.2003 9.15462 13.8805L13.7729 10.9213C14.08 10.7246 14.0799 10.276 13.7729 10.0793L9.15461 7.1203C8.65542 6.80047 8 7.15894 8 7.7518ZM5.25 3C3.45507 3 2 4.45507 2 6.25V15.25C2 17.0449 3.45508 18.5 5.25 18.5H15.75C17.5449 18.5 19 17.0449 19 15.25V6.25C19 4.45507 17.5449 3 15.75 3H5.25ZM3.5 6.25C3.5 5.2835 4.2835 4.5 5.25 4.5H15.75C16.7165 4.5 17.5 5.2835 17.5 6.25V15.25C17.5 16.2165 16.7165 17 15.75 17H5.25C4.2835 17 3.5 16.2165 3.5 15.25V6.25ZM5.01074 19.5C5.58828 20.4021 6.59923 21 7.74983 21H16.2498C19.1493 21 21.4998 18.6495 21.4998 15.75V8.74999C21.4998 7.59938 20.9019 6.58843 19.9998 6.01089V15.75C19.9998 17.8211 18.3209 19.5 16.2498 19.5H5.01074Z',
	previous: 'M20.9999 4.753C20.9999 3.34519 19.4221 2.51363 18.2607 3.30937L7.76228 10.5028C6.7521 11.1949 6.74691 12.6839 7.75223 13.3831L18.2507 20.6847C19.411 21.4917 20.9999 20.6613 20.9999 19.248V4.753ZM19.1086 4.54677C19.2745 4.43309 19.4999 4.55189 19.4999 4.753V19.248C19.4999 19.4499 19.2729 19.5685 19.1072 19.4532L8.60869 12.1517C8.46507 12.0518 8.46581 11.8391 8.61013 11.7402L19.1086 4.54677ZM3 3.75C3 3.33579 3.33579 3 3.75 3C4.16421 3 4.5 3.33579 4.5 3.75V20.25C4.5 20.6642 4.16421 21 3.75 21C3.33579 21 3 20.6642 3 20.25V3.75Z',
	quality: 'M7.68182 8C8.05838 8 8.36364 8.33579 8.36364 8.75V11.5H10.1818V8.75C10.1818 8.33579 10.4871 8 10.8636 8C11.2402 8 11.5455 8.33579 11.5455 8.75V15.25C11.5455 15.6642 11.2402 16 10.8636 16C10.4871 16 10.1818 15.6642 10.1818 15.25V13H8.36364V15.25C8.36364 15.6642 8.05838 16 7.68182 16C7.30526 16 7 15.6642 7 15.25V8.75C7 8.33579 7.30526 8 7.68182 8ZM13.5909 8C13.2144 8 12.9091 8.33579 12.9091 8.75V15.25C12.9091 15.6642 13.2144 16 13.5909 16H14.5C16.1318 16 17.4545 14.5449 17.4545 12.75V11.25C17.4545 9.45507 16.1318 8 14.5 8H13.5909ZM14.2727 14.5V9.5H14.5C15.3786 9.5 16.0909 10.2835 16.0909 11.25V12.75C16.0909 13.7165 15.3786 14.5 14.5 14.5H14.2727ZM2 6.25C2 4.45507 3.3228 3 4.95455 3H19.0455C20.6772 3 22 4.45507 22 6.25V17.75C22 19.5449 20.6772 21 19.0455 21H4.95455C3.32279 21 2 19.5449 2 17.75V6.25ZM4.95455 4.5C4.07591 4.5 3.36364 5.2835 3.36364 6.25V17.75C3.36364 18.7165 4.07591 19.5 4.95455 19.5H19.0455C19.9241 19.5 20.6364 18.7165 20.6364 17.75V6.25C20.6364 5.2835 19.9241 4.5 19.0455 4.5H12H4.95455Z',
	qualityHover: 'M14.5 14.5V9.5H14.75C15.7165 9.5 16.5 10.2835 16.5 11.25V12.75C16.5 13.7165 15.7165 14.5 14.75 14.5H14.5ZM5.25 3C3.45507 3 2 4.45507 2 6.25V17.75C2 19.5449 3.45507 21 5.25 21H18.75C20.5449 21 22 19.5449 22 17.75V6.25C22 4.45507 20.5449 3 18.75 3H5.25ZM7.25 8C7.66421 8 8 8.33579 8 8.75V11.5H10V8.75C10 8.33579 10.3358 8 10.75 8C11.1642 8 11.5 8.33579 11.5 8.75V15.25C11.5 15.6642 11.1642 16 10.75 16C10.3358 16 10 15.6642 10 15.25V13H8V15.25C8 15.6642 7.66421 16 7.25 16C6.83579 16 6.5 15.6642 6.5 15.25V8.75C6.5 8.33579 6.83579 8 7.25 8ZM13.75 8H14.75C16.5449 8 18 9.45507 18 11.25V12.75C18 14.5449 16.5449 16 14.75 16H13.75C13.3358 16 13 15.6642 13 15.25V8.75C13 8.33579 13.3358 8 13.75 8Z',
	seekBack: 'M2.74999 2.5C2.33578 2.5 2 2.83579 2 3.25V8.75C2 9.16421 2.33578 9.5 2.74999 9.5H8.25011C8.66432 9.5 9.00011 9.16421 9.00011 8.75C9.00011 8.33579 8.66432 8 8.25011 8H4.34273C5.40077 6.60212 6.77033 5.4648 8.47169 4.93832C10.5381 4.29885 12.7232 4.35354 14.7384 5.10317C16.7673 5.85787 18.6479 7.38847 19.5922 9.11081C19.7914 9.47401 20.2473 9.607 20.6105 9.40785C20.9736 9.20871 21.1066 8.75284 20.9075 8.38964C19.7655 6.30687 17.5773 4.55877 15.2614 3.69728C12.9318 2.83072 10.4069 2.7693 8.02826 3.50536C6.14955 4.08673 4.65345 5.26153 3.49999 6.64949V3.25C3.49999 2.83579 3.1642 2.5 2.74999 2.5ZM8.95266 11.0278C9.27643 11.1186 9.50022 11.4138 9.50022 11.75V20.25C9.50022 20.6642 9.16443 21 8.75022 21C8.33601 21 8.00023 20.6642 8.00023 20.25V13.8328C7.61793 14.202 7.16004 14.5788 6.63611 14.8931C6.28093 15.1062 5.82024 14.9911 5.60713 14.6359C5.39402 14.2807 5.5092 13.82 5.86438 13.6069C6.53976 13.2017 7.10401 12.6421 7.50653 12.1678C7.70552 11.9334 7.85963 11.7261 7.96279 11.5793C8.01427 11.5061 8.05276 11.4483 8.07751 11.4103C8.08989 11.3913 8.0988 11.3772 8.10417 11.3687L8.10951 11.3602L8.11019 11.359C8.28503 11.072 8.629 10.9371 8.95266 11.0278ZM13.1988 12.629C13.7527 11.6377 14.6822 11 16.002 11C17.3218 11 18.2513 11.6377 18.8052 12.629C19.3266 13.5624 19.502 14.7762 19.502 16C19.502 17.2238 19.3266 18.4376 18.8052 19.371C18.2513 20.3623 17.3218 21 16.002 21C14.6822 21 13.7527 20.3623 13.1988 19.371C12.6774 18.4376 12.502 17.2238 12.502 16C12.502 14.7762 12.6774 13.5624 13.1988 12.629ZM14.5083 13.3606C14.1704 13.9654 14.002 14.8766 14.002 16C14.002 17.1234 14.1704 18.0346 14.5083 18.6394C14.8139 19.1863 15.2593 19.5 16.002 19.5C16.7447 19.5 17.1901 19.1863 17.4957 18.6394C17.8336 18.0346 18.002 17.1234 18.002 16C18.002 14.8766 17.8336 13.9654 17.4957 13.3606C17.1901 12.8137 16.7447 12.5 16.002 12.5C15.2593 12.5 14.8139 12.8137 14.5083 13.3606Z',
	seekForward: 'M21.25 2.5C21.6642 2.5 22 2.83579 22 3.25V8.75C22 9.16421 21.6642 9.5 21.25 9.5H15.7499C15.3357 9.5 14.9999 9.16421 14.9999 8.75C14.9999 8.33578 15.3357 8 15.7499 8H19.6573C18.5992 6.60212 17.2297 5.4648 15.5283 4.93832C13.4619 4.29885 11.2768 4.35354 9.26156 5.10317C7.23271 5.85787 5.35214 7.38846 4.40776 9.11081C4.20861 9.47401 3.75274 9.607 3.38955 9.40785C3.02635 9.2087 2.89336 8.75283 3.09251 8.38964C4.23451 6.30687 6.42268 4.55877 8.73861 3.69728C11.0682 2.83072 13.5931 2.7693 15.9717 3.50536C17.8504 4.08673 19.3465 5.26153 20.5 6.64949V3.25C20.5 2.83579 20.8358 2.5 21.25 2.5ZM16.0018 11C14.6821 11 13.7525 11.6377 13.1987 12.629C12.6772 13.5624 12.5019 14.7762 12.5019 16C12.5019 17.2238 12.6772 18.4376 13.1987 19.371C13.7525 20.3623 14.6821 21 16.0018 21C17.3216 21 18.2512 20.3623 18.805 19.371C19.3265 18.4376 19.5018 17.2238 19.5018 16C19.5018 14.7762 19.3265 13.5624 18.805 12.629C18.2512 11.6377 17.3216 11 16.0018 11ZM14.0019 16C14.0019 14.8766 14.1703 13.9654 14.5082 13.3606C14.8137 12.8137 15.2591 12.5 16.0018 12.5C16.7446 12.5 17.19 12.8137 17.4955 13.3606C17.8334 13.9654 18.0018 14.8766 18.0018 16C18.0018 17.1234 17.8334 18.0346 17.4955 18.6394C17.19 19.1863 16.7446 19.5 16.0018 19.5C15.2591 19.5 14.8137 19.1863 14.5082 18.6394C14.1703 18.0346 14.0019 17.1234 14.0019 16ZM9.50005 11.75C9.50005 11.4138 9.27626 11.1186 8.9525 11.0278C8.62884 10.9371 8.28486 11.072 8.11003 11.359L8.10935 11.3602L8.10401 11.3687C8.09864 11.3772 8.08972 11.3913 8.07735 11.4103C8.05259 11.4483 8.0141 11.5061 7.96263 11.5793C7.85946 11.7261 7.70536 11.9334 7.50637 12.1678C7.10384 12.6421 6.5396 13.2016 5.86422 13.6069C5.50903 13.82 5.39386 14.2807 5.60697 14.6359C5.82008 14.9911 6.28077 15.1062 6.63595 14.8931C7.15988 14.5788 7.61776 14.202 8.00007 13.8328V20.25C8.00007 20.6642 8.33585 21 8.75006 21C9.16427 21 9.50005 20.6642 9.50005 20.25V11.75Z',
	settings: 'M12.0122 2.25C12.7462 2.25846 13.4773 2.34326 14.1937 2.50304C14.5064 2.57279 14.7403 2.83351 14.7758 3.15196L14.946 4.67881C15.0231 5.37986 15.615 5.91084 16.3206 5.91158C16.5103 5.91188 16.6979 5.87238 16.8732 5.79483L18.2738 5.17956C18.5651 5.05159 18.9055 5.12136 19.1229 5.35362C20.1351 6.43464 20.8889 7.73115 21.3277 9.14558C21.4223 9.45058 21.3134 9.78203 21.0564 9.9715L19.8149 10.8866C19.4607 11.1468 19.2516 11.56 19.2516 11.9995C19.2516 12.4389 19.4607 12.8521 19.8157 13.1129L21.0582 14.0283C21.3153 14.2177 21.4243 14.5492 21.3297 14.8543C20.8911 16.2685 20.1377 17.5649 19.1261 18.6461C18.9089 18.8783 18.5688 18.9483 18.2775 18.8206L16.8712 18.2045C16.4688 18.0284 16.0068 18.0542 15.6265 18.274C15.2463 18.4937 14.9933 18.8812 14.945 19.3177L14.7759 20.8444C14.741 21.1592 14.5122 21.4182 14.204 21.4915C12.7556 21.8361 11.2465 21.8361 9.79803 21.4915C9.48991 21.4182 9.26105 21.1592 9.22618 20.8444L9.05736 19.32C9.00777 18.8843 8.75434 18.498 8.37442 18.279C7.99451 18.06 7.5332 18.0343 7.1322 18.2094L5.72557 18.8256C5.43422 18.9533 5.09403 18.8833 4.87678 18.6509C3.86462 17.5685 3.11119 16.2705 2.6732 14.8548C2.57886 14.5499 2.68786 14.2186 2.94485 14.0293L4.18818 13.1133C4.54232 12.8531 4.75147 12.4399 4.75147 12.0005C4.75147 11.561 4.54232 11.1478 4.18771 10.8873L2.94516 9.97285C2.6878 9.78345 2.5787 9.45178 2.67337 9.14658C3.11212 7.73215 3.86594 6.43564 4.87813 5.35462C5.09559 5.12236 5.43594 5.05259 5.72724 5.18056L7.12762 5.79572C7.53056 5.97256 7.9938 5.94585 8.37577 5.72269C8.75609 5.50209 9.00929 5.11422 9.05817 4.67764L9.22824 3.15196C9.26376 2.83335 9.49786 2.57254 9.8108 2.50294C10.5281 2.34342 11.26 2.25865 12.0122 2.25ZM12.0124 3.7499C11.5583 3.75524 11.1056 3.79443 10.6578 3.86702L10.5489 4.84418C10.4471 5.75368 9.92003 6.56102 9.13042 7.01903C8.33597 7.48317 7.36736 7.53903 6.52458 7.16917L5.62629 6.77456C5.05436 7.46873 4.59914 8.25135 4.27852 9.09168L5.07632 9.67879C5.81513 10.2216 6.25147 11.0837 6.25147 12.0005C6.25147 12.9172 5.81513 13.7793 5.0771 14.3215L4.27805 14.9102C4.59839 15.752 5.05368 16.5361 5.626 17.2316L6.53113 16.8351C7.36923 16.4692 8.33124 16.5227 9.12353 16.9794C9.91581 17.4361 10.4443 18.2417 10.548 19.1526L10.657 20.1365C11.5466 20.2878 12.4555 20.2878 13.3451 20.1365L13.4541 19.1527C13.5549 18.2421 14.0828 17.4337 14.876 16.9753C15.6692 16.5168 16.6332 16.463 17.4728 16.8305L18.3772 17.2267C18.949 16.5323 19.4041 15.7495 19.7247 14.909L18.9267 14.3211C18.1879 13.7783 17.7516 12.9162 17.7516 11.9995C17.7516 11.0827 18.1879 10.2206 18.9258 9.67847L19.7227 9.09109C19.4021 8.25061 18.9468 7.46784 18.3748 6.77356L17.4783 7.16737C17.113 7.32901 16.7178 7.4122 16.3187 7.41158C14.849 7.41004 13.6155 6.30355 13.4551 4.84383L13.3462 3.8667C12.9007 3.7942 12.4526 3.75512 12.0124 3.7499ZM11.9997 8.24995C14.0708 8.24995 15.7497 9.92888 15.7497 12C15.7497 14.071 14.0708 15.75 11.9997 15.75C9.92863 15.75 8.2497 14.071 8.2497 12C8.2497 9.92888 9.92863 8.24995 11.9997 8.24995ZM11.9997 9.74995C10.7571 9.74995 9.7497 10.7573 9.7497 12C9.7497 13.2426 10.7571 14.25 11.9997 14.25C13.2423 14.25 14.2497 13.2426 14.2497 12C14.2497 10.7573 13.2423 9.74995 11.9997 9.74995Z',
	speed: 'M7.93413 16.0659C8.22703 16.3588 8.22703 16.8336 7.93413 17.1265C7.64124 17.4194 7.16637 17.4194 6.87347 17.1265C4.04217 14.2952 4.04217 9.70478 6.87347 6.87348C8.71833 5.02862 11.3099 4.38674 13.6723 4.94459C14.0755 5.03978 14.3251 5.44375 14.2299 5.84687C14.1347 6.25 13.7308 6.49963 13.3276 6.40444C11.45 5.96106 9.39622 6.47205 7.93413 7.93414C5.68862 10.1797 5.68862 13.8203 7.93413 16.0659ZM17.8879 9.1415C18.2789 9.00477 18.7067 9.21089 18.8435 9.60189C19.7333 12.1463 19.1624 15.0907 17.1265 17.1265C16.8336 17.4194 16.3588 17.4194 16.0659 17.1265C15.773 16.8336 15.773 16.3588 16.0659 16.0659C17.6791 14.4526 18.1344 12.1183 17.4276 10.097C17.2908 9.70604 17.4969 9.27824 17.8879 9.1415ZM15.8791 6.66732C16.1062 6.47297 16.439 6.46653 16.6734 6.65195C16.9078 6.83738 16.9781 7.16278 16.8412 7.42842L16.7119 7.67862C16.6295 7.83801 16.5113 8.06624 16.3681 8.34179C16.0818 8.89278 15.6954 9.63339 15.2955 10.3912C14.8959 11.1485 14.4815 11.9253 14.1395 12.5479C13.9686 12.8589 13.8142 13.1344 13.6879 13.3509C13.5703 13.5524 13.4548 13.7421 13.3688 13.8508C12.7263 14.6629 11.5471 14.8004 10.735 14.1579C9.92288 13.5154 9.78538 12.3362 10.4279 11.5241C10.5139 11.4154 10.672 11.2593 10.8409 11.0986C11.0226 10.9258 11.2552 10.7121 11.5185 10.4744C12.0457 9.9983 12.7063 9.41631 13.3514 8.85315C13.9969 8.28961 14.6288 7.74321 15.0991 7.33783C15.3343 7.1351 15.5292 6.96755 15.6654 6.85065L15.8791 6.66732ZM22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM3.5 12C3.5 16.6944 7.30558 20.5 12 20.5C16.6944 20.5 20.5 16.6944 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5C7.30558 3.5 3.5 7.30558 3.5 12Z',
	theaterMode: 'M2 7.25C2 5.45507 3.45507 4 5.25 4H18.75C20.5449 4 22 5.45507 22 7.25V16.75C22 18.5449 20.5449 20 18.75 20H5.25C3.45507 20 2 18.5449 2 16.75V7.25ZM5.25 5.5C4.2835 5.5 3.5 6.2835 3.5 7.25V16.75C3.5 17.7165 4.2835 18.5 5.25 18.5H18.75C19.7165 18.5 20.5 17.7165 20.5 16.75V7.25C20.5 6.2835 19.7165 5.5 18.75 5.5H5.25Z',
	volumeHigh: 'M15 4.25049C15 3.17187 13.7255 2.59964 12.9195 3.31631L8.42794 7.30958C8.29065 7.43165 8.11333 7.49907 7.92961 7.49907H4.25C3.00736 7.49907 2 8.50643 2 9.74907V14.247C2 15.4896 3.00736 16.497 4.25 16.497H7.92956C8.11329 16.497 8.29063 16.5644 8.42793 16.6865L12.9194 20.6802C13.7255 21.397 15 20.8247 15 19.7461V4.25049ZM9.4246 8.43059L13.5 4.80728V19.1893L9.42465 15.5655C9.01275 15.1993 8.48074 14.997 7.92956 14.997H4.25C3.83579 14.997 3.5 14.6612 3.5 14.247V9.74907C3.5 9.33486 3.83579 8.99907 4.25 8.99907H7.92961C8.48075 8.99907 9.01272 8.79679 9.4246 8.43059ZM18.9916 5.89782C19.3244 5.65128 19.7941 5.72126 20.0407 6.05411C21.2717 7.71619 22 9.77439 22 12.0005C22 14.2266 21.2717 16.2848 20.0407 17.9469C19.7941 18.2798 19.3244 18.3497 18.9916 18.1032C18.6587 17.8567 18.5888 17.387 18.8353 17.0541C19.8815 15.6416 20.5 13.8943 20.5 12.0005C20.5 10.1067 19.8815 8.35945 18.8353 6.9469C18.5888 6.61404 18.6587 6.14435 18.9916 5.89782ZM17.143 8.36982C17.5072 8.17262 17.9624 8.30806 18.1596 8.67233C18.6958 9.66294 19 10.7973 19 12.0005C19 13.2037 18.6958 14.338 18.1596 15.3287C17.9624 15.6929 17.5072 15.8284 17.143 15.6312C16.7787 15.434 16.6432 14.9788 16.8404 14.6146C17.2609 13.8378 17.5 12.9482 17.5 12.0005C17.5 11.0528 17.2609 10.1632 16.8404 9.38642C16.6432 9.02216 16.7787 8.56701 17.143 8.36982Z',
	volumeMedium: 'M14.7041 3.4425C14.8952 3.66821 15 3.95433 15 4.25003V19.7517C15 20.442 14.4404 21.0017 13.75 21.0017C13.4542 21.0017 13.168 20.8968 12.9423 20.7056L7.97513 16.4999H4.25C3.00736 16.4999 2 15.4925 2 14.2499V9.74985C2 8.50721 3.00736 7.49985 4.25 7.49985H7.97522L12.9425 3.29588C13.4694 2.84989 14.2582 2.91554 14.7041 3.4425ZM13.5 4.78913L8.52478 8.99985H4.25C3.83579 8.99985 3.5 9.33564 3.5 9.74985V14.2499C3.5 14.6641 3.83579 14.9999 4.25 14.9999H8.52487L13.5 19.2124V4.78913ZM17.1035 8.64021C17.4571 8.42442 17.9187 8.5361 18.1344 8.88967C18.7083 9.8298 18.9957 10.8818 18.9957 12.0304C18.9957 13.1789 18.7083 14.231 18.1344 15.1711C17.9187 15.5247 17.4571 15.6364 17.1035 15.4206C16.75 15.2048 16.6383 14.7432 16.8541 14.3897C17.2822 13.6882 17.4957 12.9069 17.4957 12.0304C17.4957 11.1539 17.2822 10.3726 16.8541 9.67112C16.6383 9.31756 16.75 8.85601 17.1035 8.64021Z',
	volumeLow: 'M14.7041 3.44054C14.8952 3.66625 15 3.95238 15 4.24807V19.7497C15 20.4401 14.4404 20.9997 13.75 20.9997C13.4542 20.9997 13.168 20.8948 12.9423 20.7037L7.97513 16.4979H4.25C3.00736 16.4979 2 15.4905 2 14.2479V9.7479C2 8.50526 3.00736 7.4979 4.25 7.4979H7.97522L12.9425 3.29393C13.4694 2.84794 14.2582 2.91358 14.7041 3.44054ZM13.5 4.78718L8.52478 8.9979H4.25C3.83579 8.9979 3.5 9.33369 3.5 9.7479V14.2479C3.5 14.6621 3.83579 14.9979 4.25 14.9979H8.52487L13.5 19.2104V4.78718Z',
	volumeMuted: 'M12.9195 3.31631C13.7255 2.59964 15 3.17187 15 4.25049V19.7461C15 20.8247 13.7255 21.397 12.9194 20.6802L8.42793 16.6865C8.29063 16.5644 8.11329 16.497 7.92956 16.497H4.25C3.00736 16.497 2 15.4896 2 14.247V9.74907C2 8.50643 3.00736 7.49907 4.25 7.49907H7.92961C8.11333 7.49907 8.29065 7.43165 8.42794 7.30958L12.9195 3.31631ZM13.5 4.80728L9.4246 8.43059C9.01272 8.79679 8.48075 8.99907 7.92961 8.99907H4.25C3.83579 8.99907 3.5 9.33486 3.5 9.74907V14.247C3.5 14.6612 3.83579 14.997 4.25 14.997H7.92956C8.48074 14.997 9.01275 15.1993 9.42465 15.5655L13.5 19.1893V4.80728ZM16.2197 9.22017C16.5126 8.92728 16.9874 8.92728 17.2803 9.22017L19 10.9398L20.7197 9.22017C21.0126 8.92728 21.4874 8.92728 21.7803 9.22017C22.0732 9.51307 22.0732 9.98794 21.7803 10.2808L20.0607 12.0005L21.7803 13.7202C22.0732 14.0131 22.0732 14.4879 21.7803 14.7808C21.4874 15.0737 21.0126 15.0737 20.7197 14.7808L19 13.0612L17.2803 14.7808C16.9874 15.0737 16.5126 15.0737 16.2197 14.7808C15.9268 14.4879 15.9268 14.0131 16.2197 13.7202L17.9393 12.0005L16.2197 10.2808C15.9268 9.98794 15.9268 9.51307 16.2197 9.22017Z',
	theater: 'M16.4059 10.0243C16.2283 9.78995 16.2283 9.41005 16.4059 9.17574C16.5834 8.94142 16.8712 8.94142 17.0487 9.17574L18.8669 11.5757C19.0444 11.81 19.0444 12.1899 18.8669 12.4243L17.0487 14.8243C16.8712 15.0586 16.5834 15.0586 16.4059 14.8243C16.2283 14.5899 16.2283 14.21 16.4059 13.9757L17.4481 12.6H13.4545C13.2035 12.6 13 12.3314 13 12C13 11.6686 13.2035 11.4 13.4545 11.4H17.4481L16.4059 10.0243Z M7.59414 10.0243C7.77165 9.78995 7.77165 9.41005 7.59414 9.17574C7.41663 8.94142 7.12883 8.94142 6.95132 9.17574L5.13313 11.5757C4.95562 11.81 4.95562 12.1899 5.13313 12.4243L6.95132 14.8243C7.12883 15.0586 7.41663 15.0586 7.59414 14.8243C7.77165 14.5899 7.77165 14.21 7.59414 13.9757L6.55192 12.6H10.5455C10.7965 12.6 11 12.3314 11 12C11 11.6686 10.7965 11.4 10.5455 11.4H6.55192L7.59414 10.0243Z M2 6.25C2 4.45507 3.3228 3 4.95455 3H19.0455C20.6772 3 22 4.45507 22 6.25V17.75C22 19.5449 20.6772 21 19.0455 21H4.95455C3.32279 21 2 19.5449 2 17.75V6.25ZM4.95455 4.5C4.07591 4.5 3.36364 5.2835 3.36364 6.25V17.75C3.36364 18.7165 4.07591 19.5 4.95455 19.5H19.0455C19.9241 19.5 20.6364 18.7165 20.6364 17.75V6.25C20.6364 5.2835 19.9241 4.5 19.0455 4.5H12H4.95455Z',
	theaterHover: 'M8.40586 10.0243C8.22835 9.78995 8.22835 9.41005 8.40586 9.17574C8.58337 8.94142 8.87117 8.94142 9.04869 9.17574L10.8669 11.5757C11.0444 11.81 11.0444 12.1899 10.8669 12.4243L9.04869 14.8243C8.87117 15.0586 8.58337 15.0586 8.40586 14.8243C8.22835 14.5899 8.22835 14.21 8.40586 13.9757L9.44808 12.6H5.45455C5.20351 12.6 5 12.3314 5 12C5 11.6686 5.20351 11.4 5.45455 11.4H9.44808L8.40586 10.0243Z M15.5941 10.0243C15.7717 9.78995 15.7717 9.41005 15.5941 9.17574C15.4166 8.94142 15.1288 8.94142 14.9513 9.17574L13.1331 11.5757C12.9556 11.81 12.9556 12.1899 13.1331 12.4243L14.9513 14.8243C15.1288 15.0586 15.4166 15.0586 15.5941 14.8243C15.7717 14.5899 15.7717 14.21 15.5941 13.9757L14.5519 12.6H18.5455C18.7965 12.6 19 12.3314 19 12C19 11.6686 18.7965 11.4 18.5455 11.4H14.5519L15.5941 10.0243Z M2 6.25C2 4.45507 3.3228 3 4.95455 3H19.0455C20.6772 3 22 4.45507 22 6.25V17.75C22 19.5449 20.6772 21 19.0455 21H4.95455C3.32279 21 2 19.5449 2 17.75V6.25ZM4.95455 4.5C4.07591 4.5 3.36364 5.2835 3.36364 6.25V17.75C3.36364 18.7165 4.07591 19.5 4.95455 19.5H19.0455C19.9241 19.5 20.6364 18.7165 20.6364 17.75V6.25C20.6364 5.2835 19.9241 4.5 19.0455 4.5H12H4.95455Z',
};

export const overlayStyles = [
	'overlay',
	'absolute',
	'inset-0',
	'h-full',
	'w-full',
	'z-10',
	'font-Poppins',
	'text-white',
	'fill-white',
	'font-[Poppins,sans-serif]',
	'text-xs',
	'overflow-clip',
	'group',
];

export const topBarStyles = [
	'absolute',
	'bg-gradient-to-b',
	'from-black/70',
	'top-0',
	'flex',
	'gap-1',
	'items-center',
	'p-1',
	'w-full',
	'-translate-y-full',
	'transition-transform',
	'duration-300',
];

export const bottomBarStyles = [
	'absolute',
	'bg-gradient-to-t',
	'from-black/70',
	'bottom-0',
	'flex',
	'flex-col',
	'gap-1',
	'p-1',
	'pt-6',
	'w-full',
	'translate-y-full',
	'transition-transform',
	'duration-300',
];

export const topRowStyles = [
	'relative',
	'flex',
	'gap-1',
	'h-2',
	'items-center',
	'w-full',
	'pl-3',
	'pr-2',
];

export const bottomRowStyles = [
	'relative',
	'flex',
	'gap-1',
	'h-10',
	'items-center',
	'w-full',
];

export const buttonStyles = [
	'button',
	'relative',
	'flex',
	'justify-center',
	'items-center',
	'h-10',
	'w-10',
	'p-2',
	'rounded-full',
	'cursor-pointer',
	'fill-white',
];

export const sliderBarStyles = [
	'slider',
	'flex',
	'bg-white',
	'relative',
	'h-2',
	'w-full',
	'rounded-full',
	'outline-l-red-400',
];

export const sliderBufferStyles = [
	'slider-buffer',
	'flex',
	'bg-red-300',
	'absolute',
	'h-2',
	'z-0',
	'rounded-r-full',
	'pointer-events-none',
];

export const sliderProgressStyles = [
	'slider-progress',
	'flex',
	'bg-red-600',
	'absolute',
	'h-2',
	'z-10',
	'rounded',
	'rounded-r-full',
	'pointer-events-none',
];

export const sliderThumbStyles = [];

export const sliderNippleStyles = [
	'slider-nipple',
	'absolute',
	'top-0',
	'left-0',
	'h-4',
	'w-4',
	'bg-red-600',
	'rounded-full',
	'z-20',
	'-translate-y-1/4',
	'-translate-x-1/2',
];

export const sliderPopStyles = [
	'slider-pop',
	'absolute',
	'bottom-4',
	'p-2',
	'bg-red-600',
	'z-20',
	'-translate-x-1/2',
];

export const sliderPopImageStyles = ['slider-pop-image'];

export const timeStyles = [
	'flex',
	'font-mono',
	'text-sm',
	'items-center',
	'select-none',
	'time',
];

export const dividerStyles = [
	'divider',
	'flex',
];

export const chapterMarkersStyles = [
	'chapter-marker',
	'absolute',
	'bg-black/60',
	'bottom-0',
	'-left-10',
	'w-1.5',
	'h-full',
	'z-10',
	'pointer-events-none',
];

export const iconStyles = ['text-white'];

export interface Buttons {
    [key: string]: {
        classes: string[];
        path: string;
    }
}

export const buttons = (options: VideoPlayerOptions) => {
	const buttons: Buttons = {};

	for (const icon of Object.keys(fluentIcons)) {
		buttons[icon] = {
			classes: [...(options.buttons?.icons?.[icon]?.classes ?? iconStyles)],
			path: options.buttons?.icons?.[icon]?.path ?? fluentIcons[icon],
		};
	}

	return buttons;
};