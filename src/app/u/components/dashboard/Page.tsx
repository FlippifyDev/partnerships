import Link from "next/link";

const Page = () => {

    return (
        <div className="min-h-screen flex justify-center items-center border">
            <span>This page is in development, please go to <Link href="coupon" className="text-(--color-houseBlue) hover:underline">Coupon</Link></span>
        </div>
    );
};

export default Page;
