

async function test() {
  try {
    const url = 'https://res.cloudinary.com/ohlktbko/image/upload/v1783342355/portfolio_resumes/resume_1783342355872.pdf';
    console.log("Testing URL:", url);
    const res = await fetch(url, { method: 'HEAD' });
    console.log("Status:", res.status);
    console.log("Status text:", res.statusText);
    console.log("Headers:", JSON.stringify(Object.fromEntries(res.headers.entries()), null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
