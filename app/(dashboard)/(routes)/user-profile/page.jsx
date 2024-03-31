import { UserProfile } from "@clerk/nextjs";

const UserProfilePage = () => (
  <div className="mx-auto flex justify-center items-center">
    <div className="mt-0 md:mt-10">
      <UserProfile path="/user-profile" routing="path" />
    </div>
  </div>
);

export default UserProfilePage;
