import NextAuth from "next-auth";
import {authConfig} from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
    const user = req.auth?.user

    if(user && !user.tutorialDone && !req.nextUrl.pathname.startsWith("/tutorial")){
        return Response.redirect(new URL("/tutorial", req.nextUrl.origin))
    }
})

export const config = {
    matcher: [
        "/((?!api/auth|auth|_next|favicon.ico).*)",
    ],
}