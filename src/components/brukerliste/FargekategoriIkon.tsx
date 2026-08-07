import { Fargekategori } from "@/data/brukere";

export function FargekategoriIkon({ kategori }: { kategori?: Fargekategori }) {
    switch (kategori) {
        case "A":
            return <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden><path d="M20.1879 15.5732C20.5784 15.9637 20.5804 16.5998 20.165 16.9637C18.0417 18.8236 15.4786 20.0162 12.9275 20.3128C10.0764 20.6443 7.47377 19.8297 5.69217 18.0481C3.91058 16.2665 3.09593 13.6639 3.42745 10.8128C3.7241 8.26167 4.91668 5.6986 6.77659 3.57527C7.14049 3.15983 7.77652 3.16187 8.16705 3.55239L14.1775 9.5628L20.1879 15.5732Z" fill="#3386E0" stroke="#23262A" strokeWidth="1.5" /></svg>;
        case "B":
            return <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden><path d="M21 20L11.7568 3L3 20H21Z" fill="#66C786" stroke="#23262A" strokeWidth="1.5" strokeLinejoin="round" /></svg>;
        case "C":
            return <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden><circle cx="12" cy="12" r="8.75" fill="#F5F100" stroke="#23262A" strokeWidth="1.5" /></svg>;
        case "D":
            return <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden><path d="M20 4H4V20H20V4Z" fill="#A18DBB" stroke="#23262A" strokeWidth="1.5" strokeLinejoin="round" /></svg>;
        case "E":
            return <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden><path d="M12 3L21.035 9.56434L17.584 20.1857H6.41604L2.96496 9.56434L12 3Z" fill="#7CDAF8" stroke="#23262A" strokeWidth="1.5" strokeLinejoin="round" /></svg>;
        case "F":
            return <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden><path d="M20.5 12L12 2L3.5 12L12 22L20.5 12Z" fill="#FFAA33" stroke="#23262A" strokeWidth="1.5" strokeLinejoin="round" /></svg>;
        default:
            return <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden><rect x="2.5" y="2.5" width="19" height="19" stroke="var(--ax-text-neutral)" strokeWidth="1.5" strokeLinejoin="round" /><path fillRule="evenodd" clipRule="evenodd" d="M17.7283 6.28621C16.6904 5.24058 15.0005 5.23755 13.9588 6.27944L6.79864 13.4413C6.70854 13.5314 6.64288 13.643 6.60788 13.7655L5.52816 17.5454C5.45344 17.807 5.52622 18.0885 5.71835 18.2811C5.91047 18.4737 6.19182 18.5471 6.45358 18.473L10.2255 17.4054C10.3488 17.3705 10.461 17.3046 10.5516 17.214L17.7215 10.0425C18.7578 9.00597 18.7608 7.32644 17.7283 6.28621ZM15.0196 7.33998C15.474 6.88552 16.211 6.88685 16.6637 7.34293C17.1142 7.7968 17.1129 8.5297 16.6607 8.98195L16.6111 9.03159L14.9697 7.38986L15.0196 7.33998ZM13.9092 8.45064L7.99681 14.3644L7.34017 16.6632L9.62898 16.0153L15.5506 10.0924L13.9092 8.45064Z" fill="var(--ax-text-neutral)" /></svg>;
    }
}

export const fargekategoriIkonHeader = (
    <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <rect x="2.5" y="2.5" width="19" height="19" stroke="var(--ax-text-neutral)" strokeWidth="1.5" strokeLinejoin="round" />
        <path fillRule="evenodd" clipRule="evenodd" d="M17.7283 6.28621C16.6904 5.24058 15.0005 5.23755 13.9588 6.27944L6.79864 13.4413C6.70854 13.5314 6.64288 13.643 6.60788 13.7655L5.52816 17.5454C5.45344 17.807 5.52622 18.0885 5.71835 18.2811C5.91047 18.4737 6.19182 18.5471 6.45358 18.473L10.2255 17.4054C10.3488 17.3705 10.461 17.3046 10.5516 17.214L17.7215 10.0425C18.7578 9.00597 18.7608 7.32644 17.7283 6.28621ZM15.0196 7.33998C15.474 6.88552 16.211 6.88685 16.6637 7.34293C17.1142 7.7968 17.1129 8.5297 16.6607 8.98195L16.6111 9.03159L14.9697 7.38986L15.0196 7.33998ZM13.9092 8.45064L7.99681 14.3644L7.34017 16.6632L9.62898 16.0153L15.5506 10.0924L13.9092 8.45064Z" fill="var(--ax-text-neutral)" />
    </svg>
);
