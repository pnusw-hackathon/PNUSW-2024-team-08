import AdoptPetDetail from "../../../src/components/units/adopt/[id]/AdoptPetDetail.container";
import { checkAuth } from "../../../src/components/commons/utils/auth";
import {
  fetchPetDetailWithAuth,
  fetchPetDetailWithoutAuth,
} from "../../../src/components/units/adopt/[id]/AdoptPetDetail.queries";

export default function AdoptPetDetailPage({ isSSRLoggedIn, petDetailData }) {
  return (
    <>
      <AdoptPetDetail
        isSSRLoggedIn={isSSRLoggedIn}
        petDetailData={petDetailData}
      />
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    console.log("getServerSideProps called for /adopt/[id]");
    const { id } = context.params;

    if (!id) {
      throw new Error("Missing pet ID");
    }

    const authResult = await checkAuth(context);
    console.log("authResult in /adopt/[id]:", authResult);
    const accessToken = context.req.cookies.accessToken;
    let petDetailData = null;

    if (authResult.props.isSSRLoggedIn && accessToken) {
      console.log(`Fetching pet detail with auth for id: ${id}`);
      petDetailData = await fetchPetDetailWithAuth(id, accessToken);
    } else {
      console.log(`Fetching pet detail without auth for id: ${id}`);
      petDetailData = await fetchPetDetailWithoutAuth(id);
    }

    return {
      props: {
        ...authResult.props,
        petDetailData,
      },
    };
  } catch (error) {
    console.error(
      `Error fetching pet details in adopt/[id] getServerSideProps: ${error.message}`
    );
    return {
      props: {
        isSSRLoggedIn: false,
        petDetailData: null,
        error: "Failed to fetch pet details",
      },
    };
  }
}
