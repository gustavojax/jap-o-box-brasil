export default async function handler(req, res) {
  // Só aceita POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { tracking_number } = req.body;

  if (!tracking_number) {
    return res.status(400).json({ error: "Tracking number required" });
  }

  try {
    // CHAMADA PARA 17TRACK
    const response = await fetch("https://api.17track.net/track/v1/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "17token": process.env.TRACKING_API_KEY,
      },
      body: JSON.stringify({
        numbers: [tracking_number],
      }),
    });

    const data = await response.json();

    // valida resposta
    const item = data?.data?.accepted?.[0];

    if (!item) {
      return res.status(404).json({
        error: "Tracking not found",
      });
    }

    // normaliza resposta para seu frontend
    const result = {
      currentStatus:
        item.latest_status?.status || "Desconhecido",

      currentDescription:
        item.latest_status?.description ||
        "Atualização não disponível",

      steps:
        item.events?.map((e) => ({
          status: e.status,
          location: e.location,
          date: e.time,
        })) || [],
    };

    return res.status(200).json(result);

  } catch (error) {
    console.error("TRACKING ERROR:", error);

    return res.status(500).json({
      error: "Tracking service error",
    });
  }
}
