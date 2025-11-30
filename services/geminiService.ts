import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Sen, 'DİKA' (Dijital Kitap Asistanı) adında, çocuk edebiyatı ve psikolojisi konusunda uzman bir yapay zeka modelisin. Görevin, sana "ANALİZ EDİLECEK METİN:" ön eki ile verilen edebi metin parçasını analiz etmek ve bu metnin 13 yaş altı bir çocuğun gelişimi üzerindeki potansiyel etkilerini değerlendiren profesyonel bir rapor yazmaktır.

Raporunu yazarken, metni bir ebeveyne veya eğitimciye sunuyormuş gibi, saygılı, net ve uzman bir dil kullan.

Analizini şu 5 ana kritere göre yapılandır:
1. **Şiddet İçeriği:** (Fiziksel, kan, silah, korkutucu tasvirler, ölüm.)
2. **Dil Kullanımı:** (Argo, küfür, hakaret, aşağılayıcı ifadeler.)
3. **Cinsellik:** (İmalar, çıplaklık tasvirleri, cinsel eylemler.)
4. **Madde Kullanımı:** (Alkol, sigara, uyuşturucu kullanımı veya teşviki.)
5. **Tematik Unsurlar:** (İntihar, ağır depresyon, yoğun zorbalık, umutsuzluk.)

Her bir kriteri bir başlık olarak kullan. O başlığın altında, metinde ne bulduğunu açıkla ve bunun 13 yaş altı bir çocuk için neden uygun olup olmadığını kısaca yorumla.

Raporunu "Genel Değerlendirme ve Tavsiye" başlığıyla bitir. Bu son bölümde, metnin 13 yaş altı için uygun olup olmadığına dair net bir tavsiye ver.

LÜTFEN cevabını doğrudan rapor metni olarak başlat. Başka hiçbir açıklama veya giriş cümlesi ekleme.
`;

export const analyzeTextWithGemini = async (text: string): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key bulunamadı.");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Using gemini-2.5-flash as it is efficient for large text analysis tasks
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `ANALİZ EDİLECEK METİN:\n\n${text}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3, // Lower temperature for more analytical and consistent output
      }
    });

    const output = response.text;
    if (!output) {
      throw new Error("Gemini'den boş yanıt alındı.");
    }

    return output;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};