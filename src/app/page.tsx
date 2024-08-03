import Link from 'next/link';

Link;

function Page() {
  return (
    <>
      <div className="m-5">LandingPage of the Course Platform</div>
      <Link className="bg-emerald-300 rounded-md p-2 mx-5" href={'/course'}>
        To the Course
      </Link>
    </>
  );
}

export default Page;
