'use client'

import { api, RouterOutputs } from "~/trpc/react";
import EmailEditor from "../email-editor/email-editor";
import useThreads from "~/hooks/use-threads";
import React from "react";
import { toast } from "sonner";


const ReplyBox = () => {

    const { threadId, accountId } = useThreads();
    const { data : replyDetails } = api.account.getReplyDetails.useQuery({
        accountId,
        threadId: threadId ?? ""
    })

    if (!replyDetails) { 
        return null
    }

    return (
        <Component replyDetails={replyDetails} />
    )

}

const Component = ({ replyDetails }: { replyDetails: RouterOutputs["account"]["getReplyDetails"] }) => {
    const { threadId, accountId } = useThreads();

    // if subject not starts with 'Re', manually add it
    const [subject, setSubject] = React.useState(replyDetails.subject.startsWith('Re:') ? replyDetails.subject : `Re: ${replyDetails.subject}`);

    // construct toValues
    const [toValues, setToValues] = React.useState<{ label: string, value: string }[]>(replyDetails.to.map(to => ({ label: to.address ?? to.name, value: to.address })) || [])

    // construct ccValues
    const [ccValues, setCcValues] = React.useState<{ label: string, value: string }[]>(replyDetails.cc.map(cc => ({ label: cc.address ?? cc.name, value: cc.address })) || [])

    // apply reconstruction if change thread
    React.useEffect(() => { 
        // check existence
        if (!threadId || !replyDetails) { 
            return 
        }
    
        // Re-construct new data structure
        if (!replyDetails.subject.startsWith('Re:')) {
            setSubject(`Re: ${replyDetails.subject}`)
        }

        setToValues(replyDetails.to.map(to => ({ label: to.address ?? to.name, value: to.address })))
        setCcValues(replyDetails.cc.map(cc => ({ label: cc.address ?? cc.name, value: cc.address })))

    }, [threadId, replyDetails])

    const sendEmail = api.account.sendEmail.useMutation();

    const handleSend = async (value: string) => { 
        if (!replyDetails) { 
            return
        }
        sendEmail.mutate({
            accountId,
            threadId: threadId ?? undefined,
            body: value,
            subject,
            from: replyDetails.from,
            to: replyDetails.to.map(to => ({ address: to.address, name: to.name ?? ""})),
            cc: replyDetails.cc.map(cc => ({ address: cc.address, name: cc.name ?? "" })),
            replyTo: replyDetails.from,
            inReplyTo: replyDetails.internetMessageId
        }, {
            onSuccess: () => {
                toast.success("Email sent");
            },
            onError: (error) => {
                toast.error("Error sending email")
            }
        }) 
    }


    return (
        <EmailEditor
            subject={subject}
            setSubject={setSubject}

            toValues={toValues}
            setToValues={setToValues}

            ccValues={ccValues}
            setCCValues={setCcValues}

            // get addresses used to show them on editor
            to={replyDetails.to.map(to => to.address)}

            // for send email button
            isSending={sendEmail.isPending}
            handleSend={handleSend}

            defaultToolBarExpanded={ false }
        />
    )
}

export default ReplyBox;

