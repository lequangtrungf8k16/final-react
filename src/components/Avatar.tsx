import type { TPropsAvatar } from "../types/avatar";

export default function Avatar({ img, small }: TPropsAvatar) {
    return (
        <div>
            <img src={img} alt="" className={`${small ? "w-10" : "w-50"}`} />
        </div>
    );
}
