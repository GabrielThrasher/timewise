import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { dataClient } from "../../dataClient";
import Button from "../Button";
import Input from "../Input";

function FriendsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isShowingResults, setIsShowingResults] = useState(false);
  const [isShowingRequests, setIsShowingRequests] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState<any[] | null>(null);
  const navigate = useNavigate();

  const onSearch = async () => {
    if (searchQuery === "") return;

    setIsShowingResults(true);
    const users = await dataClient.searchUsers(searchQuery);
    setSearchResults(users);
  };

  const onAddFriend = async (uid: string) => {
    await dataClient.addFriend(uid);
  };

  const onAcceptFriendReq = async (uid: string) => {
    await dataClient.acceptRequest(uid);
  };

  useEffect(() => {
    async function fetchRequests() {
      const requests = await dataClient.getRequests();
      // console.log(requests);
      setFriendRequests(requests);
    }
    async function fetchFriends() {
      const friends = await dataClient.getFriends();
      // console.log(requests);
      setFriends(friends);
    }

    fetchFriends();
    fetchRequests();
  }, [isShowingRequests]);

  return (
    <div className="flex flex-col relative">
      <div className="flex items-center gap-2 px-2 text-sm">
        <Input
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
          placeholder="Search by name..."
          className="grow-1 my-2"
        />
        <Button onClick={onSearch} className="py-2 px-1 text-xs">
          🔎 Search
        </Button>
      </div>
      <div className="hover:cursor-pointer">
        {isShowingResults ? (
          <div className="max-h-40 overflow-auto">
            {searchResults.map((user) => (
              <FriendsListItem
                isSearching
                name={user.name}
                key={user.uid}
                onAddFriend={() => onAddFriend(user.uid)}
              />
            ))}
          </div>
        ) : isShowingRequests ? (
          <div className="max-h-40 overflow-auto">
            {friendRequests.map((user: any) => (
              <FriendsListItem
                isIncomingReq
                name={user.name}
                key={user.uid}
                onAcceptReq={() => onAcceptFriendReq(user.uid)}
              />
            ))}
          </div>
        ) : (
          <div>
            {!friends ? (
              <p>Loading...</p>
            ) : (
              friends.map((f) => (
                <FriendsListItem
                  key={f.uid}
                  name={f.name}
                  navigate={navigate}
                  id={f.uid}
                />
              ))
            )}
          </div>
        )}
      </div>
      {isShowingResults || isShowingRequests ? (
        <button
          className="absolute right-3 -top-9 text-sm hover:underline cursor-pointer"
          onClick={() => {
            setIsShowingResults(false);
            setIsShowingRequests(false);
          }}
        >
          Show my friends
        </button>
      ) : (
        friendRequests.length > 0 && (
          <button
            className="absolute right-3 -top-9 text-sm hover:underline cursor-pointer"
            onClick={() => setIsShowingRequests(true)}
          >
            {friendRequests.length} incoming requests
          </button>
        )
      )}
    </div>
  );
}

type FriendsListItemProps = {
  id?: any;
  name: string;
  isSearching?: boolean;
  isIncomingReq?: boolean;
  onAddFriend?: () => void;
  onAcceptReq?: () => void;
  navigate?: any;
};

function FriendsListItem({
  id,
  name,
  isSearching,
  isIncomingReq,
  onAddFriend,
  onAcceptReq,
  navigate,
}: FriendsListItemProps) {
  return (
    <div
      className="w-full flex items-center justify-between pl-4 py-2 hover:bg-gray-100"
      onClick={(e) => {
        e.preventDefault();
        navigate &&
          navigate({ to: "/friends/$friendId", params: { friendId: id } });
      }}
    >
      <p>{name}</p>

      {isSearching && (
        <button
          className="mr-2 text-sm cursor-pointer hover:bg-gray-200 rounded-md p-1"
          onClick={(e) => {
            e.stopPropagation();
            onAddFriend && onAddFriend();
          }}
        >
          + Add
        </button>
      )}

      {isIncomingReq && (
        <button
          className="mr-2 text-sm cursor-pointer hover:bg-gray-200 rounded-md p-1"
          onClick={(e) => {
            e.stopPropagation();
            onAcceptReq && onAcceptReq();
          }}
        >
          ✅ Accept
        </button>
      )}
    </div>
  );
}

export default FriendsList;
