import { ProjectENV } from '@env';
import { Metadata, NextPage } from 'next';
import Image from 'next/image';

import { RouterMeta } from '@/constants/router';

import { Section } from './Section';

export const metadata: Metadata = RouterMeta.Docs;

const Intro: {
  title: string;
  descs: string[];
}[] = [
  {
    title: '🎯 Project Goal',
    descs: [
      'To create a DeSo dApp that connects real-life data with blockchain on Tron. Think of it as a one-stop-shop where anyone can issue or receive claims about pretty much anything in life.',
    ],
  },
  {
    title: '💎 Project Value',
    descs: [
      'SunID addresses the lack of a DeSo application in the Tron ecosystem that connects real-world data with on-chain information. It unifies and authenticates fragmented data points, ensuring trust and accessibility. By leveraging blockchain technology, SunID provides a secure, transparent, and decentralized platform for managing and verifying various claims, from credentials to financial statuses.',
    ],
  },
  {
    title: '🚀 Project Details',
    descs: [
      'SunID is your bridge between the real world and the blockchain universe! :bridge_at_night: It works with two main players: issuers and holders. Issuers dish out credentials, and holders receive them. These credentials can be stored on-chain (Tron blockchain) or off-chain (BTFS), depending on your needs.',
    ],
  },
];

const SunIDDoc: NextPage = () => {
  return (
    <main className="py-16 space-y-8">
      {Intro.map((item, i) => (
        <Section key={i} {...item} />
      ))}
      <iframe
        className="mx-auto max-w-7xl !my-12"
        title="SUNID - SunID Documentation"
        src="https://player.vimeo.com/video/1017377903?h=48a9d2ad92"
        width={1800}
        height="500"></iframe>
      <div className="section !bg-white">
        <h1 className="text-xl font-bold">🧩 System design</h1>
        <div className=" border border-gray-200 rounded-xl mt-8 max-w-5xl mx-auto">
          <div className="mb-8 max-w-2xl mx-auto py-12">
            <Image
              src="/arch.png"
              alt="Architecture Diagram"
              layout="responsive"
              width={100}
              height={50}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
      <div className="!bg-white max-w-7xl mx-auto">
        <h1 className="text-xl font-bold mb-4">🔑 Key Features</h1>
        <ul className="list-disc ml-6 flex flex-col gap-2">
          <li>
            <strong>Flexible Storage:</strong> Credentials can be stored either on-chain (using the
            TRON network) or off-chain (via BTFS), giving users control over their storage
            preferences.
          </li>
          <li>
            <strong>Issue and Revoke:</strong> Simple, user-friendly system for issuing and revoking
            credentials. Easy peasy.
          </li>
          <li>
            <strong>Unique Credential ID:</strong> Each credential has a unique ID for easy
            revocation and verification.
          </li>
          <li>The platform is open-source, so feel free to jump in with ideas and improvements!</li>
        </ul>
      </div>
      <div className="!bg-white max-w-7xl mx-auto ">
        <h1 className="text-xl font-bold">🧪 Project Test Instructions</h1>
        <div className="px-8">
          <p className="my-2">
            Heads up! We’re working on the Shasta network. To grab some test tokens, hop over to the{' '}
            <a href="https://shasta.tronex.io/" target="_blank" className="text-main underline">
              Shasta Tron Faucet
            </a>
            .
          </p>
          <h2 className="text-lg font-semibold my-2">* Mainflow in SUNDID</h2>
          <h3 className="font-bold">1. Create Schema:</h3>
          <div className="space-y-2">
            <p>
              Schemas define the data fields and types used in credentials. Each schema gets a
              unique ID on-chain.
            </p>
            <ul className="list-decimal ml-6 mt-2">
              <li>Go to the Schema Page and connect your wallet.</li>
              <li>Click the Create Schema button.</li>
              <li>
                Complete the form:
                <ul className="list-disc ml-6">
                  <li>
                    <strong>Name:</strong> The schema’s name.
                  </li>
                  <li>
                    <strong>Schema Definition:</strong> Define your schema’s template to specify
                    data types for credentials.
                  </li>
                  <li>
                    <strong>Resolver Address (Optional):</strong> The TRON address of the entity
                    responsible for managing the schema.
                  </li>
                  <li>
                    <strong>Revocable:</strong> Specify whether credentials issued under this schema
                    can be revoked.
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <h3 className="mt-4 font-bold">2. Issue a Credential:</h3>
          <div className="space-y-2">
            <p>Prerequisite: You must have an existing schema to issue credentials.</p>
            <ul className="list-decimal ml-6 mt-2">
              <li>Select the schema you want to use.</li>
              <li>
                In the Schema Detail page, click the Issue Credential With This Schema button.
              </li>
              <li>
                Fill out the form:
                <ul className="list-disc ml-6">
                  <li>
                    <strong>Recipient:</strong> TRON address of credential recipient.
                  </li>
                  <li>
                    <strong>Credential Data:</strong> Provide data according to the schema template.
                  </li>
                  <li>
                    <strong>Expiration:</strong> (Optional) Set an expiration date for the
                    credential.
                  </li>
                  <li>
                    <strong>RefUID:</strong> Reference a Credential UID.
                  </li>
                  <li>
                    <strong>Revocable:</strong> If the schema allows revocation, you can later
                    revoke the credential.
                  </li>
                </ul>
              </li>
              <li>
                Choose whether to issue the credential on-chain (stored on TRON) or off-chain
                (stored on BTFS).
              </li>
            </ul>
          </div>

          <h3 className="mt-4 font-bold">3. Revoke a Credential:</h3>
          <p>Prerequisite: You must be a credential issuer.</p>
          <ul className="list-decimal ml-6 mt-2">
            <li>
              Select the schema you used to issue the credential you want to revoke. You can find
              the credential in two ways:
            </li>
            <ul className="list-disc ml-6">
              <li>If you have the credential UID, use the search bar at the top of the page.</li>
              <li>
                Click on the <strong>My Credentials</strong> tab to see all issued credentials.
              </li>
            </ul>
            <li>
              Click the <strong>Revoke</strong> button on the top right corner.
            </li>
            <li>
              For off-chain credentials, this submits the credential UID to the chain. Verifiers can
              check if this Credential UID is revoked by querying the blockchain.
            </li>
          </ul>
        </div>
      </div>
      <section className="!my-12">
        <h2 className="subtitle">Smart Contract Deployment</h2>
        <p>TRON Shasta Testnet:</p>
        <table className="table-auto mt-4 border-collapse border border-gray-400 w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Contract</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Address</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">SchemaRegistry</td>
              <td className="border border-gray-300 px-4 py-2">
                {ProjectENV.NEXT_PUBLIC_SCHEMA_REGISTRY_ADDRESS}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">SunID</td>
              <td className="border border-gray-300 px-4 py-2">
                {ProjectENV.NEXT_PUBLIC_SUN_ID_ADDRESS}
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <section className="!bg-white !mt-0">
        <h2 className="text-lg font-bold">🎇 Project Milestones</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>
            <strong>Onchain/Offchain Storage:</strong> Support issuing credentials on TRON and BTFS.
            ✅
          </li>
          <li>
            <strong>Enhanced Data Indexing:</strong> Improve on-chain data indexers for more
            efficient data access. 🔜
          </li>
          <li>
            <strong>Service Dockerization:</strong> Dockerize APIs and Explorer services, enabling
            users to easily deploy custom services.
          </li>
          <li>
            <strong>Wallet Integration:</strong> Develop a plugin to add SunID credentials as assets
            in TronLink or a custom version of TronLink.
          </li>
          <li>
            <strong>Privacy Enhancement:</strong> Implement zero-knowledge proof technology to
            verify on-chain credentials, improving privacy and security.
          </li>
        </ul>
      </section>
      <h1 className="max-w-7xl mx-auto text-xl font-bold">
        The platform is open-source, so feel free to jump in with ideas and improvements! 🎉
      </h1>
    </main>
  );
};

export default SunIDDoc;
