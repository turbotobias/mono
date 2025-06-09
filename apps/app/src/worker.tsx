import { get_date_time_now_with_seconds } from "@mono/utils";
import { index, render } from "rwsdk/router";
import { defineApp } from "rwsdk/worker";
import { Document } from "~/Document";
import { setCommonHeaders } from "~/headers";

//function useMounted() {
//  const [is_mounted, set_is_mounted] = React.useState(false)
//  React.useEffect(() => {
//    set_is_mounted(true)
//  }, [])
//  return is_mounted
//}

export default defineApp([
  setCommonHeaders(),
  ({ ctx }) => {
    // setup ctx here
    ctx
  },
  render(Document, [index([() => {
    // TODO: uncomment this and its related code to see if rwsdk is working
    // const is_mounted = useMounted()

    return (
      <>
        <p>{get_date_time_now_with_seconds()}</p>

        {/*

        React.useState is not a function or its return value is not iterable
        at async ProxyServer.fetch

        */}
        {/* <p>{is_mounted ? "mounted" : "not mounted"}</p>
        {is_mounted && (
          <a href={location.href}>Refresh</a>
        )} */}
      </>
    )
  }])]),
]);
