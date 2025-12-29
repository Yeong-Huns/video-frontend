import {NextRequest} from "next/dist/server/web/spec-extension/request";
import {NextResponse} from "next/dist/server/web/spec-extension/response";

export function middleware(request: NextRequest) {
    const token = request.cookies.get('accessToken');
    const isAuthPage = request.nextUrl.pathname.startsWith('/sign-in');

    /* 로그인이 필요한 서비스 접근 시 */
    if (!token && !isAuthPage) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    /* 이미 로그인했는데 로그인 페이지 접근 시 */
    if (token && isAuthPage) {
        return NextResponse.redirect(new URL('/', request.url));
    }
}

export const config = { matcher: ['/((?!api|_next|static).*)'] };
